import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solvent } from "../target/types/solvent";
import {
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
import { expect } from "chai";
import * as fs from "fs";
import * as path from "path"; // Import the 'path' module

describe("solvent", () => {
  // Configure the client to use the local cluster
  const connection = new anchor.web3.Connection(
    "http://127.0.0.1:8899",
    "confirmed"
  );

  // Load wallet from the tests/ directory
  const walletPath = path.resolve(__dirname, "solvent-dev-wallet.json");
  const walletKeypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(walletPath, "utf-8")))
  );

  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  anchor.setProvider(provider);

  const program = anchor.workspace.Solvent as Program<Solvent>;
  const owner = walletKeypair;

  it("Initializes a gas tank", async () => {
    const [gasTankPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("gas_tank"), owner.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initializeTank()
      .accounts({
        gasTank: gasTankPda,
        owner: owner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([owner])
      .rpc();

    const gasTankAccount = await program.account.gasTank.fetch(gasTankPda);
    expect(gasTankAccount.owner.toString()).to.equal(
      owner.publicKey.toString()
    );
  });

  it("Deposits SOL to the gas tank", async () => {
    const [gasTankPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("gas_tank"), owner.publicKey.toBuffer()],
      program.programId
    );

    const depositAmount = 1 * LAMPORTS_PER_SOL;

    await program.methods
      .depositSol(new anchor.BN(depositAmount))
      .accounts({
        gasTank: gasTankPda,
        owner: owner.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([owner])
      .rpc();

    const balance = await provider.connection.getBalance(gasTankPda);
    expect(balance).to.be.greaterThan(0);
  });
});

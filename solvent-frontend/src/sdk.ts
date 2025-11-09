import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
// Use a type-only import for WalletContextState
import type { WalletContextState } from "@solana/wallet-adapter-react";

// Import the IDL and the program type
import idl from "./solvent.json";
// Use a type-only import for the 'Solvent' type
import type { Solvent } from "./types/solvent";

// The program ID for your deployed program
const PROGRAM_ID = new PublicKey(idl.address);

/**
 * Creates and returns an Anchor program instance.
 * @param wallet - The user's wallet object from the wallet adapter.
 * @param connection - The Solana connection object.
 * @returns The Anchor program instance.
 */
export const getProgram = (
  wallet: WalletContextState,
  connection: Connection
) => {
  if (!wallet.publicKey) throw new Error("Wallet not connected!");

  // The AnchorProvider bridges the app and the Solana network
  const provider = new AnchorProvider(
    connection,
    wallet as any, // The wallet adapter's wallet is compatible with Anchor's
    AnchorProvider.defaultOptions()
  );

  // Create the program instance
  const program = new Program<Solvent>(idl as any, provider);

  return program;
};

/**
 * Calculates the Program Derived Address (PDA) for the user's gas tank.
 * @param ownerPublicKey - The public key of the wallet owner.
 * @returns The PublicKey of the gas tank PDA.
 */
export const getGasTankPda = (ownerPublicKey: PublicKey) => {
  const [gasTankPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("gas_tank"), ownerPublicKey.toBuffer()],
    PROGRAM_ID
  );
  return gasTankPda;
};

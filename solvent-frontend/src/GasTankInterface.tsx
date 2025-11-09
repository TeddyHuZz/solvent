import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getProgram, getGasTankPda } from "./sdk";

export function GasTankInterface() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey } = wallet;

  const [gasTankAddress, setGasTankAddress] = useState<string | null>(null);
  const [gasTankBalance, setGasTankBalance] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState("0.1");
  const [isLoading, setIsLoading] = useState(false);

  // Function to check for an existing gas tank and update its balance
  const refreshGasTank = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      const program = getProgram(wallet, connection);
      const pda = getGasTankPda(publicKey);

      // Try to fetch the account
      const accountInfo = await program.account.gasTank.fetch(pda);
      if (accountInfo) {
        setGasTankAddress(pda.toBase58());
        // Also fetch the lamport balance of the PDA
        const balance = await connection.getBalance(pda);
        setGasTankBalance(balance);
      }
    } catch (error) {
      // If fetching fails, it likely means the account doesn't exist
      console.log("No gas tank found for this wallet.");
      setGasTankAddress(null);
      setGasTankBalance(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on component mount and when wallet changes
  useEffect(() => {
    refreshGasTank();
  }, [publicKey, connection]);

  const handleCreateTank = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    try {
      const program = getProgram(wallet, connection);
      const pda = getGasTankPda(publicKey);

      await program.methods
        .initializeTank()
        .accounts({
          gasTank: pda,
          owner: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      alert("Gas Tank created successfully!");
      await refreshGasTank(); // Refresh state
    } catch (error) {
      console.error("Failed to create gas tank:", error);
      alert("Failed to create gas tank.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!publicKey || !gasTankAddress) return;

    setIsLoading(true);
    try {
      const program = getProgram(wallet, connection);
      const lamports = parseFloat(depositAmount) * LAMPORTS_PER_SOL;

      await program.methods
        .depositSol(new BN(lamports))
        .accounts({
          gasTank: gasTankAddress,
          owner: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      alert("Deposit successful!");
      await refreshGasTank(); // Refresh balance
    } catch (error) {
      console.error("Failed to deposit:", error);
      alert("Failed to deposit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTank = async () => {
    if (!publicKey || !gasTankAddress) return;

    const confirmed = window.confirm(
      "Are you sure you want to close this gas tank? All remaining SOL will be returned to your wallet."
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      const program = getProgram(wallet, connection);
      const pda = getGasTankPda(publicKey);

      await program.methods
        .closeTank()
        .accounts({
          gasTank: pda,
          owner: publicKey,
        })
        .rpc();

      alert("Gas Tank closed successfully!");
      // Manually reset state to show the "Create" view immediately
      setGasTankAddress(null);
      setGasTankBalance(null);
    } catch (error) {
      console.error("Failed to close gas tank:", error);
      alert("Failed to close gas tank.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      {gasTankAddress ? (
        <div>
          <h3 style={{ marginBottom: "20px" }}>Your Gas Tank is Active!</h3>
          <div className="address-display" style={{ marginBottom: "10px" }}>
            Address: {gasTankAddress}
          </div>
          <div className="balance-display" style={{ marginBottom: "10px" }}>
            {gasTankBalance !== null
              ? (gasTankBalance / LAMPORTS_PER_SOL).toFixed(4)
              : "..."}{" "}
            SOL
          </div>
          <div className="deposit-group">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount in SOL"
            />
            <button onClick={handleDeposit} disabled={isLoading}>
              Deposit SOL
            </button>
          </div>
          <button
            onClick={handleCloseTank}
            disabled={isLoading}
            className="button-danger"
          >
            Close Gas Tank
          </button>
        </div>
      ) : (
        <div>
          <h3>No Gas Tank Found</h3>
          <p>Create a gas tank to get started.</p>
          <button onClick={handleCreateTank} disabled={isLoading}>
            Create Gas Tank
          </button>
        </div>
      )}
    </div>
  );
}

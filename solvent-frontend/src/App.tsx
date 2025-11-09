import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import "./index.css";
import logo from "/solvent.png";
import { GasTankInterface } from "./GasTankInterface";

function App() {
  const { connected } = useWallet();

  return (
    <div className="App">
      <header className="header">
        <img src={logo} alt="SOLVent Logo" className="logo" />
        <h1>SOLVent</h1>
        <WalletMultiButton />
      </header>

      <main className="main-content">
        {/* Only show the interface if the wallet is connected */}
        {connected ? (
          <GasTankInterface />
        ) : (
          <div className="container">
            <h2>Please connect your wallet to manage a gas tank.</h2>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

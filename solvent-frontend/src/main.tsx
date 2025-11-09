import React, { FC, useMemo } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Buffer } from "buffer";

// Polyfill Buffer for browser environment
window.Buffer = Buffer;

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Import the wallet adapter's CSS
import "@solana/wallet-adapter-react-ui/styles.css";

const AppWithWallet: FC = () => {
  // Use 'devnet' as the base network
  const network = WalletAdapterNetwork.Devnet;
  // Set the endpoint to the public devnet RPC
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Add all the wallets you want to support
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithWallet />
  </React.StrictMode>
);

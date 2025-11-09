<h1 align="center">Solvent</h1>

<p align="center">
  <strong>A secure, on-chain "gas tank" with spending rules for autonomous AI agents on Solana.</strong>
  <br />
  <br />
  <a href="httpsListen_to_this_inspiring_solana_development_for_beginners_video">
    <img src="https://img.shields.io/badge/Live_Demo-solvent.vercel.app-brightgreen" alt="Live Demo" />
  </a>
  <a href="https://solana.com/x402/hackathon">
    <img src="https://img.shields.io/badge/Solana_x402_Hackathon-2025-blueviolet" alt="Hackathon" />
  </a>
  <a href="https://github.com/TeddyHuZz/solvent/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
  </a>
</p>

---

## Problem

The new x402 "agent economy" requires AI agents to pay for API calls autonomously. To do this, an agent needs a wallet with SOL.

> However, giving an AI agent a private key is a **massive security risk**. A single bug or exploit in the agent's code could allow it to drain the owner's entire wallet. This friction makes it dangerous and difficult for developers to build and deploy autonomous agents.

## 💡 Solution

**Solvent** is an on-chain "gas tank" that solves this problem.

It's a simple smart contract that allows an owner to create a secure, sandboxed wallet (a PDA) for each of their agents. The owner can then:

1.  **Fund the Tank:** Deposit a small amount of SOL (e.g., 0.5 SOL).
2.  **Set Rules:** Program an on-chain rule, like `"max_spend_per_tx: 0.01 SOL"`.

> The agent can then use the Solvent SDK to pay for its own x402 calls. The on-chain program **guarantees** the agent can never spend more than its allowance, making it truly trustless. The owner's main funds are always 100% safe.

## 🛠️ How It Works (Architecture)

1.  **On-Chain Program (`/program`):** An Anchor (Rust) smart contract deployed to Devnet. It handles creating the `GasTank` PDA, depositing/withdrawing funds, and enforcing the `agent_spend` rules.
2.  **Web App (`/frontend`):** A React/Vite app hosted on Vercel. This is the **Owner's Dashboard** for connecting a wallet, creating tanks, and funding them.
3.  **Agent SDK (`/sdk`):** A simple TypeScript SDK that any "agent" can use to call the `agentSpend` function, which is protected by the on-chain rules.

## 🧑‍💻 How to Use (SDK)

Solvent is a developer tool. Here is how easy it is to use:

### 1. The Owner (Setup)

The owner uses the React app or a script to create and fund the tank.

```typescript
import { solvent } from "./sdk";

// 1. Set the rules for the agent
const rules = { maxSpendPerTx: 0.1 * LAMPORTS_PER_SOL };

// 2. Initialize the tank on-chain
await solvent.initializeTank(owner, agent.publicKey, rules);

// 3. Fund the tank
await solvent.depositSol(owner, agent.publicKey, 0.5 * LAMPORTS_PER_SOL);
```

## 💻 Local Development
```typescript
// Clone Repo
// git clone
// cd solvent

// Build Program
// anchor build
// anchor deploy

// Run Frontend
// cd solvent-frontend
// npm install
// npm run dev
```

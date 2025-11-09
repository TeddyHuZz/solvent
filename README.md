The Problem
The new x402 "agent economy" requires AI agents to pay for API calls autonomously. To do this, an agent needs a wallet with SOL.

However, giving an AI agent a private key is a massive security risk. A single bug or exploit in the agent's code could allow it to drain the owner's entire wallet. This friction makes it dangerous and difficult for developers to build and deploy autonomous agents.


The Solution
Solvent is an on-chain "gas tank" that solves this problem.

It's a simple smart contract that allows an owner to create a secure, sandboxed wallet (a PDA) for each of their agents. The owner can then:

Fund the Tank: Deposit a small amount of SOL (e.g., 0.5 SOL).

Set Rules: Program an on-chain rule, like "max_spend_per_tx: 0.01 SOL".

The agent can then use the Solvent SDK to pay for its own x402 calls. The on-chain program guarantees the agent can never spend more than its allowance, making it truly trustless. The owner's main funds are always 100% safe.


🛠️ How It Works (Architecture)
On-Chain Program (/program): An Anchor (Rust) smart contract deployed to Devnet. It handles creating the GasTank PDA, depositing/withdrawing funds, and enforcing the agent_spend rules.

Web App (/frontend): A React/Vite app hosted on Vercel. This is the Owner's Dashboard for connecting a wallet, creating tanks, and funding them.

Agent SDK (/sdk): A simple TypeScript SDK that any "agent" can use to call the agentSpend function, which is protected by the on-chain rules.


🧑‍💻 How to Use (SDK)
Solvent is a developer tool. Here is how easy it is to use:

1. The Owner (Setup)
The owner uses the React app or a script to create and fund the tank.

TypeScript

import { solvent } from "./sdk";

// 1. Set the rules for the agent
const rules = { maxSpendPerTx: 0.1 * LAMPORTS_PER_SOL };

// 2. Initialize the tank on-chain
await solvent.initializeTank(owner, agent.publicKey, rules);

// 3. Fund the tank
await solvent.depositSol(owner, agent.publicKey, 0.5 * LAMPORTS_PER_SOL);
2. The AI Agent (Spending)
The autonomous agent uses its own keypair to spend from the tank.

TypeScript

import { solvent } from "./sdk";

const apiProviderAddress = new PublicKey("...");
const paymentAmount = 0.05 * LAMPORTS_PER_SOL;

// The agent tries to pay for an x402 API
try {
  await solvent.agentSpend(agent, paymentAmount, apiProviderAddress);
  console.log("Payment successful!");
} catch (e) {
  // This will fail if paymentAmount > rules.maxSpendPerTx
  console.error("Payment failed! (Blocked by on-chain rules)");
}
🏆 x402 Hackathon Submission
This project was built for the Solana x402 Hackathon (November 2025).

We are submitting for the following tracks:

Best x402 Dev Tool: Solvent is a core piece of infrastructure that accelerates and secures all x402 agent development.

Best AgentPay Demo: Our demo shows the complete, end-to-end loop of an agent autonomously and safely paying for an API.

Best use of CDP embedded wallets: Solvent is a decentralized, open-source implementation of a policy-controlled wallet, built from first principles on Solana.


💻 Local Development
Clone: git clone https://github.com/TeddyHuZz/solvent.git

Build & Deploy Program:

Bash

cd solvent
anchor build
anchor deploy

cd ../frontend
npm install
npm run dev

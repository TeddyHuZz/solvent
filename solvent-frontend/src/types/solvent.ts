/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solvent.json`.
 */
export type Solvent = {
  address: "AuXUBafybLucgxw65twLs4RrwDnXDnxnfQxRrzamiDpq";
  metadata: {
    name: "solvent";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "agentSpend";
      discriminator: [23, 170, 137, 159, 219, 53, 9, 61];
      accounts: [
        {
          name: "gasTank";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 97, 115, 95, 116, 97, 110, 107];
              },
              {
                kind: "account";
                path: "gas_tank.owner";
                account: "gasTank";
              }
            ];
          };
        },
        {
          name: "agent";
          signer: true;
          relations: ["gasTank"];
        },
        {
          name: "destination";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "depositSol";
      discriminator: [108, 81, 78, 117, 125, 155, 56, 200];
      accounts: [
        {
          name: "gasTank";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 97, 115, 95, 116, 97, 110, 107];
              },
              {
                kind: "account";
                path: "owner";
              }
            ];
          };
        },
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "initializeTank";
      discriminator: [202, 65, 158, 247, 228, 246, 171, 136];
      accounts: [
        {
          name: "gasTank";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 97, 115, 95, 116, 97, 110, 107];
              },
              {
                kind: "account";
                path: "owner";
              }
            ];
          };
        },
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "setConfig";
      discriminator: [108, 158, 154, 175, 212, 98, 52, 66];
      accounts: [
        {
          name: "gasTank";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 97, 115, 95, 116, 97, 110, 107];
              },
              {
                kind: "account";
                path: "owner";
              }
            ];
          };
        },
        {
          name: "owner";
          signer: true;
          relations: ["gasTank"];
        }
      ];
      args: [
        {
          name: "agentPubkey";
          type: "pubkey";
        },
        {
          name: "rules";
          type: {
            defined: {
              name: "rules";
            };
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "gasTank";
      discriminator: [130, 160, 112, 156, 37, 128, 62, 80];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "spendingLimitExceeded";
      msg: "Spending limit exceeded";
    },
    {
      code: 6001;
      name: "insufficientFunds";
      msg: "Insufficient funds in gas tank";
    }
  ];
  types: [
    {
      name: "gasTank";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "agent";
            type: "pubkey";
          },
          {
            name: "rules";
            type: {
              defined: {
                name: "rules";
              };
            };
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "rules";
      type: {
        kind: "struct";
        fields: [
          {
            name: "maxSpendPerTx";
            type: "u64";
          }
        ];
      };
    }
  ];
};

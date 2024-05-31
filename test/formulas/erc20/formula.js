const paramsSchema = {
  properties: {
    name: {
      type: "string",
    },
    symbol: {
      type: "string",
    },
    totalSupply: {
      type: "integer",
      exclusiveMinimum: 0,
    },
  },
  required: ["name", "symbol", "totalSupply"],
};

function deploy(params) {
  const [address] = api.hardhat.script({
    path: "./scripts/deploy.ts",
    envs: {
      TOKEN_NAME: params.name,
      TOKEN_SYMBOL: params.symbol,
      TOKEN_SUPPLY: params.totalSupply.toString(),
    },
    outputs: [
      {
        name: "address",
        extract: {
          type: "regex",
          expr: "My token deployed with address (?<address>0x[a-zA-Z0-9]{40})",
          groupName: "address",
        },
      },
    ],
  });

  api.offchain.deploy({
    details: {
      envs: {
        TOKEN_ADDRESS: address,
        RPC_URL: params.config.common.rpcUrl(),
      },
      flags: {
        build: true,
      },
    },
  });
}

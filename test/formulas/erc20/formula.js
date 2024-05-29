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
  api.hardhat.script({
    path: "./scripts/deploy.ts",
    envs: {
      TOKEN_NAME: params.name,
      TOKEN_SYMBOL: params.symbol,
      TOKEN_SUPPLY: params.totalSupply.toString(),
    },
  });

  api.offchain.deploy({
    details: {
      envs: {
        RPC_URL: params.config.common.rpcUrl(),
      },
    },
  });
}

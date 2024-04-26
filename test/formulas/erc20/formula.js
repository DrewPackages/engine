function deploy() {
  api.hardhat.script({
    path: "./scripts/deploy.ts",
    envs: {
      TOKEN_NAME: "Test Token",
      TOKEN_SYMBOL: "TT",
      TOKEN_SUPPLY: "10000",
    },
  });
}

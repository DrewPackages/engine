function deploy() {
  api.hardhat.script({
    path: "./scripts/deploy.ts",
  });

  api.wallet.sign({
    msg: "0x123123124142",
  });
}

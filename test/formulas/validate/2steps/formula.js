function deploy() {
  api.foundry.sign({
    msg: "0x123123124142",
  });

  api.hardhat.script({
    path: "./scripts/deploy.ts",
  });
}

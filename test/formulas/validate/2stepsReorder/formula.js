function deploy() {
  api.hardhat.script({
    path: "./scripts/deploy.ts",
  });

  api.foundry.sign({
    msg: "0x123123124142",
  });
}

function deploy() {
  api.truffle.script({
    path: "./scripts/deploy.ts",
  });
}

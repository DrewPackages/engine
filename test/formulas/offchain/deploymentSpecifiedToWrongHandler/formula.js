function deploy() {
  api.offchain.deploy({
    handlerType: "deployment-offchain",
    details: {
      c: "123",
      d: "abc",
    },
  });
}

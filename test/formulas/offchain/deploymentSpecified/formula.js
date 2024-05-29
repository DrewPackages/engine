function deploy() {
  api.offchain.deploy({
    handlerType: "deployment-offchain",
    details: {
      a: "123",
      b: "abc",
    },
  });
}

function deploy() {
  api.offchain.ui({
    handlerType: "deployment-offchain",
    details: {
      c: "123",
      d: "abc",
    },
  });
}

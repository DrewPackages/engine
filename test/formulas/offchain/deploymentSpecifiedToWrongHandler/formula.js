function deploy() {
  api.offchain.deploy({
    handlerType: "ui-offchain",
    details: {
      c: "123",
      d: "abc",
    },
  });
}

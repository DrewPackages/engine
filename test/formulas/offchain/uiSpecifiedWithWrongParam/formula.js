function deploy() {
  api.offchain.ui({
    handlerType: "ui-offchain",
    details: {
      c: "123",
      d: 123,
    },
  });
}

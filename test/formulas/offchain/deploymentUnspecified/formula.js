function deploy() {
  api.offchain.deploy({
    details: {
      a: "123",
      b: "abc",
    },
  });
}

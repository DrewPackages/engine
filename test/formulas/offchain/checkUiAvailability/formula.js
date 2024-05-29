function deploy() {
  if (api.offchain.isUIDeployable) {
    api.offchain.ui({
      details: {
        c: "123",
        d: "abc",
      },
    });
  }
}

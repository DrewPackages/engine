function deploy() {
  const signed = api.foundry.sign({
    msg: "0x123",
  });

  api.foundry.sign({
    msg: signed,
  });
}

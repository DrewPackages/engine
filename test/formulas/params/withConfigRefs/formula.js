function deploy(params) {
  api.foundry.sign({
    msg: params.config.common.rpcUrl(),
  });
}

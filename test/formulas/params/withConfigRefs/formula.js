function deploy(params) {
  api.wallet.sign({
    msg: params.config.common.rpcUrl(),
  });
}

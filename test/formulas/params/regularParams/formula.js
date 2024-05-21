const paramsSchema = {
  properties: {
    message: {
      type: "string",
    },
    iterations: {
      type: "integer",
      exclusiveMinimum: 0,
    },
    tail: {
      type: "boolean",
    },
  },
  required: ["message", "iterations"],
};

function deploy(params) {
  for (let index = 0; index < params.iterations; index++) {
    api.wallet.sign({
      msg: params.message,
    });
  }
  if (params.tail) {
    api.wallet.sign({
      msg: "tail",
    });
  }
}

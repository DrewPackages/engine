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
    api.foundry.sign({
      msg: params.message,
    });
  }
  if (params.tail) {
    api.foundry.sign({
      msg: "tail",
    });
  }
}

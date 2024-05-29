import { DrewError } from "../../errors";

export class OffchainHandlerNotFound extends DrewError {
  constructor(public readonly requestedHandler: string) {
    super(`Offchain handler ${requestedHandler} not found`, "validate");
  }
}

export class OperationNotSupportedByOffchainHandlers extends DrewError {
  constructor(public readonly operation: string) {
    super(
      `Offchain handlers doesn't support the operation '${operation}'`,
      "validate"
    );
  }
}

export class OperationNotSupportedByOffchainHandler extends DrewError {
  constructor(
    public readonly requestedHandler: string,
    public readonly operation: string
  ) {
    super(
      `Offchain handler ${requestedHandler} doesn't support the operation ${operation}`,
      "validate"
    );
  }
}

export class InvalidOffchainDetails extends DrewError {
  constructor(
    public readonly requestedHandler: string,
    public readonly operation: string
  ) {
    super(
      `Offchain handler ${requestedHandler} fails operation '${operation}' details validation`,
      "validate"
    );
  }
}

type DrewErrorAction = "validate" | "execute" | "unspecified";

export abstract class DrewError extends Error {
  public readonly name = "DrewError";

  constructor(msg: string, public readonly action: DrewErrorAction) {
    super(msg);
  }
}

export class UnknownStageError extends DrewError {
  constructor(stage: string) {
    super(`Unknown stage '${stage}' in api calls`, "validate");
  }
}

export class UnknownApiError extends DrewError {
  constructor(api: string) {
    super(`Unknown api name '${api}' in register api list`, "validate");
  }
}

export class UnknownApiCallError extends DrewError {
  constructor(group: string, version: number, method: string) {
    super(
      `Unknown api call '${group}/${version}/${method}' in register api list`,
      "execute"
    );
  }
}

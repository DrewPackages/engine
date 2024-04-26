import { Token } from "typedi";
import { ApiCallDescriptor, StageInstruction } from "../types";

export const API_PARSER_TOKEN = new Token<BaseApiParser>("API_PARSER");

export abstract class BaseApiParser {
  constructor(
    public readonly apiGroup: string,
    public readonly apiVersion: number
  ) {}

  public isCallGroupSupported(call: ApiCallDescriptor): boolean {
    return call.group === this.apiGroup && call.version === this.apiVersion;
  }

  public abstract parse<T extends ApiCallDescriptor>(
    call: T
  ): Promise<StageInstruction>;
}

import { Token } from "typedi";
import { ApiCallDescriptor } from "../../api/types";
import { StageInstruction, ValueOrOutput, ValueRef } from "../types";
import { isConfigRef } from "../../params";
import { ConfigStorage } from "../config";
import { IStateStorageFetcher } from "../../state";

export const API_PARSER_TOKEN = new Token<BaseApiParser>("API_PARSER");

export abstract class BaseApiParser {
  constructor(
    public readonly apiGroup: string,
    public readonly apiVersion: number,
    protected readonly configs: ConfigStorage,
    private readonly state: IStateStorageFetcher
  ) {}

  value<T>(valueOrRef?: ValueRef<T>): string | T | ValueOrOutput<T> {
    if (valueOrRef == null) {
      return undefined;
    }

    if (isConfigRef(valueOrRef)) {
      return this.configs.resolve(valueOrRef);
    } else {
      return valueOrRef;
    }
  }

  public isCallGroupSupported(call: ApiCallDescriptor): boolean {
    return call.group === this.apiGroup && call.version === this.apiVersion;
  }

  public abstract parse<T extends ApiCallDescriptor>(
    call: T
  ): Promise<StageInstruction>;
}

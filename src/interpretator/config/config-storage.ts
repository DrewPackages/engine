import { ConfigRef } from "src/params/config-refs";
import {
  ApiConfigAlreadyResolvedError,
  ApiConfigNotResolvedError,
} from "../../errors";
import { EvmConfig } from "./evm/type";
import { Service } from "typedi";

@Service()
export class ConfigStorage {
  private readonly storage: Map<string, object> = new Map();

  set<T extends EvmConfig>(api: string, resolvedConfig: T) {
    if (this.storage.has(api)) {
      throw new ApiConfigAlreadyResolvedError(api);
    }
    this.storage.set(api, resolvedConfig);
  }

  get<T extends EvmConfig>(api: string): T {
    if (!this.storage.has(api)) {
      throw new ApiConfigNotResolvedError(api);
    }
    return this.storage.get(api) as T;
  }

  resolve(ref: ConfigRef): string {
    if (!this.storage.has(ref.group)) {
      throw new ApiConfigNotResolvedError(ref.group);
    }

    return this.storage.get(ref.group)[ref.key];
  }
}

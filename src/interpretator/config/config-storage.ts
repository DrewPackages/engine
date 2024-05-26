import {
  ApiConfigAlreadyResolvedError,
  ApiConfigNotResolvedError,
} from "../../errors";
import { CommonConfig } from "./common/type";
import { Service } from "typedi";

@Service()
export class ConfigStorage {
  private readonly storage: Map<string, object> = new Map();

  set<T extends CommonConfig>(api: string, resolvedConfig: T) {
    if (this.storage.has(api)) {
      throw new ApiConfigAlreadyResolvedError(api);
    }
    this.storage.set(api, resolvedConfig);
  }

  get<T extends CommonConfig>(api: string): T {
    if (!this.storage.has(api)) {
      throw new ApiConfigNotResolvedError(api);
    }
    return this.storage.get(api) as T;
  }
}

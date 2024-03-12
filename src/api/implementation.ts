import { Container } from "typedi";
import { API_TOKEN, IApiScheduler } from "./types";
import { UnknownApiError } from "@src/errors";

export class Api {
  public readonly schedulers: Map<string, IApiScheduler> = new Map();

  constructor(apis: Array<string>) {
    apis.forEach((api) => {
      const handler = Container.get<IApiScheduler>(`api-${api}`);

      if (!handler) {
        throw new UnknownApiError(api);
      }

      this.schedulers.set(api, handler);
    });
  }

  isApiSupported(api: string) {
    return this.schedulers.has(api);
  }
}

export function instantiateApi(apis: Array<string>) {
  const proxiedApi = new Proxy(new Api(apis), {
    get(target, p: string) {
      if (!target.isApiSupported(p)) {
        throw new UnknownApiError(p);
      }

      return target.schedulers.get(p);
    },
  });

  Container.set(API_TOKEN, proxiedApi);
}

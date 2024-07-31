import { ConfigRef } from "../../params/config-refs";

export interface IConfigStorage<T extends object = object> {
  set(api: string, resolvedConfig: T);
  get(api: string): T;
  resolve(ref: ConfigRef): string;
}

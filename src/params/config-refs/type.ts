import z from "zod";

export class ConfigRef {
  public readonly type = "config-ref";

  constructor(public readonly group: string, public readonly key: string) {}

  toString() {
    return `ConfigRef('${this.group}', '${this.key}')`;
  }
}

export const ConfigRefSchema = z.object({
  group: z.string(),
  key: z.string(),
});

export function isConfigRef(smtn: any): smtn is ConfigRef {
  return ConfigRefSchema.safeParse(smtn).success;
}

export type ValueOrConfigRef<T> = T | ConfigRef;

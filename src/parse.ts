import "reflect-metadata";
import { Container } from "typedi";
import { ApiCall } from "./api";
import {
  ENVIRONMENT_RESOLVER_TOKEN,
  IEnvironmentResolver,
  resolveConfigs,
  API_PARSER_TOKEN,
  BaseApiParser,
  StageInstruction,
} from "./interpretator";
import { UnknownApiCallError } from "./errors";

export async function parse(
  calls: Array<ApiCall>,
  env: IEnvironmentResolver
): Promise<Array<StageInstruction>> {
  Container.set(ENVIRONMENT_RESOLVER_TOKEN, env);
  await resolveConfigs();

  const parsers = Container.getMany<BaseApiParser>(API_PARSER_TOKEN);

  const instructions = await Promise.all(
    calls.map((c) => {
      const parser = parsers.find((p) => p.isCallGroupSupported(c));

      if (!parser) {
        throw new UnknownApiCallError(c.group, c.version, c.method);
      }

      return parser.parse(c);
    })
  );

  return instructions;
}

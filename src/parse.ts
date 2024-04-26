import "reflect-metadata";
import { Container } from "typedi";
import { ApiCall, IEnvironmentResolver } from "./api";
import { StageInstruction } from "./api/types";
import { ENVIRONMENT_RESOLVER_TOKEN } from "./api/config";
import { API_PARSER_TOKEN, BaseApiParser } from "./api/parser";
import { UnknownApiCallError } from "./errors";

export async function parse(
  calls: Array<ApiCall>,
  env: IEnvironmentResolver
): Promise<Array<StageInstruction>> {
  Container.set(ENVIRONMENT_RESOLVER_TOKEN, env);

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

import { ScheduleOutput } from "src/state";
import { IQueue } from "../queue/types";
import { Token } from "typedi";

export type ApiCallDescriptor = {
  group: string;
  version: number;
  method: string;
};

export type ApiCall<
  A extends Array<any> = Array<any>,
  M extends object = object
> = ApiCallDescriptor & {
  args: A;
  metadata: M;
  stage: string;
  outputs: Array<ScheduleOutput>;
  requiredConfigGroups: Array<string>;
};

export type OutputInfo = {
  name: string;
  extract?: OutputExtract;
};

export type StdoutOutputSpec = {
  type: "stdout";
};

export type StderrOutputSpec = {
  type: "stderr";
};

export type RegexOutputSpec = {
  type: "regex";
  stream?: "stdout" | "stderr";
  expr: RegExp | string;
  groupName: string;
};

export type OutputExtract =
  | RegexOutputSpec
  | StdoutOutputSpec
  | StderrOutputSpec;

export type ApiMethodContext = { queue: IQueue };

export type IApiScheduler<T extends string = string> = Record<
  T,
  (this: ApiMethodContext, arg: any) => void
>;

export type IApi = Record<string, IApiScheduler>;

export const API_TOKEN = new Token<IApi>("API_TOKEN");

export function isCall<T extends ApiCallDescriptor>(
  group: string,
  version: number,
  method: string,
  call: ApiCallDescriptor
): call is T {
  return (
    call.group === group && call.version === version && call.method === method
  );
}

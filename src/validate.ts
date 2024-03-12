import "reflect-metadata";
import Container from "typedi";
import { QUEUE_TOKEN } from "./queue";
import {
  API_TOKEN,
  ApiCall,
  DEFAULT_APIS,
  DEFAULT_STAGES,
  instantiateApi,
} from "./api";
import { IFormulaFetcher } from "./fetcher";
import { EXECUTE_FROMULA_POSTFIX } from "./constants";

type DeployArgs<T extends object = {}> = {
  formulaName: string;
  values: T;
};

type FormulaExecutionResult = Partial<{
  stages: Array<string>;
}>;

export async function validate(
  args: DeployArgs,
  fetcher: IFormulaFetcher
): Promise<Array<ApiCall>> {
  instantiateApi(DEFAULT_APIS);
  const api = Container.get(API_TOKEN);

  const formulaText = await fetcher.fetchFormulaFileText(
    args.formulaName,
    "formula.js"
  );

  const results: FormulaExecutionResult =
    eval(formulaText + EXECUTE_FROMULA_POSTFIX) || {};

  const queue = Container.get(QUEUE_TOKEN);

  return queue.executionScript(results.stages || DEFAULT_STAGES);
}

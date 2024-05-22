import "reflect-metadata";
import { Container as TypeDIContainer } from "typedi";
import { QUEUE_TOKEN } from "./queue";
import {
  API_TOKEN,
  ApiCall,
  DEFAULT_APIS,
  DEFAULT_STAGES,
  instantiateApi,
} from "./api";
import { IFormulaFetcher } from "./fetcher";
import { EXECUTE_FORMULA_PREFIX, EXECUTE_FROMULA_POSTFIX } from "./constants";
import { readParams, validateParam } from "./params";
import _eval from "eval";

type DeployArgs<T extends object = {}> = {
  formulaName: string;
  values: T;
};

type FormulaExecutionResult = Partial<{
  stages: Array<string>;
}>;

export async function validate(
  args: DeployArgs,
  fetcher: IFormulaFetcher,
  params?: object
): Promise<Array<ApiCall>> {
  instantiateApi(DEFAULT_APIS);

  const formulaText = await fetcher.fetchFormulaFileText(
    args.formulaName,
    "formula.js"
  );

  const paramsSchema = readParams(formulaText);
  validateParam(params, paramsSchema);

  const results: FormulaExecutionResult =
    _eval(
      EXECUTE_FORMULA_PREFIX +
        formulaText +
        "module.exports = " +
        EXECUTE_FROMULA_POSTFIX(params),
      "formula-validate.js",
      {
        Container: TypeDIContainer,
        API_TOKEN: API_TOKEN,
      }
    ) || {};

  const queue = TypeDIContainer.get(QUEUE_TOKEN);

  return queue.executionScript(results.stages || DEFAULT_STAGES);
}

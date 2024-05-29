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
import { addConfigs, readParamsSchema, validateParam } from "./params";
import _eval from "eval";
import { DEFAULT_OFFCHAIN_API } from "./api/constants";

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
  instantiateApi(DEFAULT_APIS, DEFAULT_OFFCHAIN_API);

  const formulaText = await fetcher.fetchFormulaFileText(
    args.formulaName,
    "formula.js"
  );

  const paramsSchema = readParamsSchema(formulaText);
  validateParam(params, paramsSchema);

  const preparedParams = addConfigs(params || {});

  const results: FormulaExecutionResult =
    _eval(
      EXECUTE_FORMULA_PREFIX +
        formulaText +
        "module.exports = " +
        EXECUTE_FROMULA_POSTFIX,
      "formula-validate.js",
      {
        Container: TypeDIContainer,
        API_TOKEN: API_TOKEN,
        param: preparedParams,
      }
    ) || {};

  const queue = TypeDIContainer.get(QUEUE_TOKEN);

  return queue.executionScript(results.stages || DEFAULT_STAGES);
}

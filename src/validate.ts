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
import { DEFAULT_OFFCHAIN_API } from "./api/constants";
import { runInFunction } from "./utils/function";
import { IStateStorage, STATE_STORAGE_TOKEN } from "./state";

type DeployArgs = {
  formulaName: string;
  apis?: Array<string>;
  offchainHandlers?: Array<string>;
};

type FormulaExecutionResult = Partial<{
  stages: Array<string>;
}>;

export async function validate(
  args: DeployArgs,
  fetcher: IFormulaFetcher,
  state: IStateStorage,
  params?: object
): Promise<Array<ApiCall>> {
  TypeDIContainer.set(STATE_STORAGE_TOKEN, state);

  instantiateApi(
    args.apis != null ? args.apis : DEFAULT_APIS,
    args.offchainHandlers != null ? args.offchainHandlers : DEFAULT_OFFCHAIN_API
  );

  const formulaText = await fetcher.fetchFormulaFileText(
    args.formulaName,
    "formula.js"
  );

  const paramsSchema = readParamsSchema(formulaText);
  validateParam(params, paramsSchema);

  const preparedParams = addConfigs(params || {});

  const results: FormulaExecutionResult =
    runInFunction(
      {
        Container: TypeDIContainer,
        API_TOKEN: API_TOKEN,
        param: preparedParams,
      },
      EXECUTE_FORMULA_PREFIX + formulaText + EXECUTE_FROMULA_POSTFIX
    ) || {};

  const queue = TypeDIContainer.get(QUEUE_TOKEN);

  return queue.executionScript(results?.stages || DEFAULT_STAGES);
}

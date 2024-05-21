import { JsonSchema } from "json-schema-library";
import { InvalidParamSchemaError } from "../errors";
import _eval from "eval";

const PARAMS_SCHEMA_VAR_NAME = "paramsSchema";
const DEFAULT_ID = "/FormulaParams";
const DRAFT_URL = "https://json-schema.org/draft/2020-12/schema";

export function readParams(formulaText: string): JsonSchema | undefined {
  const paramTypeObject: JsonSchema = formulaText.includes(
    PARAMS_SCHEMA_VAR_NAME
  )
    ? _eval(formulaText + "\n module.exports = " + PARAMS_SCHEMA_VAR_NAME + ";")
    : {};

  if (
    paramTypeObject.properties != null &&
    Object.keys(paramTypeObject.properties).length > 0
  ) {
    if (
      paramTypeObject.type !== undefined &&
      paramTypeObject.type !== "object"
    ) {
      throw new InvalidParamSchemaError();
    }

    const { properties, required, $id } = paramTypeObject;
    return {
      $id: $id || DEFAULT_ID,
      properties,
      required,
      type: "object",
    };
  }
}

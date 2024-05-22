import { Schema } from "jsonschema";
import { InvalidParamSchemaError } from "../errors";
import _eval from "eval";

const PARAMS_SCHEMA_VAR_NAME = "paramsSchema";
const DRAFT_URL = "https://json-schema.org/draft/2020-12/schema";

export function readParams(formulaText: string): Schema | undefined {
  const paramTypeObject: Schema = formulaText.includes(PARAMS_SCHEMA_VAR_NAME)
    ? _eval(
        formulaText + "\n module.exports = " + PARAMS_SCHEMA_VAR_NAME + ";",
        "formula-read-params.js"
      )
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

    const { properties, required } = paramTypeObject;
    return {
      $schema: DRAFT_URL,
      properties,
      required,
      type: "object",
      additionalProperties: false,
    };
  }
}

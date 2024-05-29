import { Schema } from "jsonschema";
import { InvalidParamSchemaError } from "../errors";

const PARAMS_SCHEMA_VAR_NAME = "paramsSchema";
const DRAFT_URL = "https://json-schema.org/draft/2020-12/schema";

export function readParamsSchema(formulaText: string): Schema | undefined {
  const paramTypeObject: Schema = formulaText.includes(PARAMS_SCHEMA_VAR_NAME)
    ? eval(formulaText + "\n" + PARAMS_SCHEMA_VAR_NAME + ";")
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

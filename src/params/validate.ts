import { Schema, validate } from "jsonschema";
import { InvalidParamError, ParamSchemaNotFoundError } from "../errors";

export function validateParam(param?: object, schema?: Schema) {
  if (schema == undefined && param != undefined) {
    throw new ParamSchemaNotFoundError();
  }

  if (schema != undefined && param == undefined) {
    throw new InvalidParamError();
  }

  if (schema && param) {
    const validationResult = validate(param, schema, {
      allowUnknownAttributes: false,
    });

    if (validationResult.errors.length > 0) {
      throw new InvalidParamError(validationResult.errors);
    }
  }
}

import { Draft2019, JsonSchema } from "json-schema-library";
import { InvalidParamError, ParamSchemaNotFoundError } from "../errors";

export function validateParam(param?: object, schema?: JsonSchema) {
  if (schema == undefined && param != undefined) {
    throw new ParamSchemaNotFoundError();
  }

  if (schema != undefined && param == undefined) {
    throw new InvalidParamError();
  }

  if (schema && param) {
    const jsonSchema = new Draft2019(schema);
    Object.keys(param).forEach((param) => {
      if (!(param in schema.properties)) {
        throw new InvalidParamError();
      }
    });
    const validationResult = jsonSchema.validate(param);

    if (validationResult.length > 0) {
      throw new InvalidParamError(validationResult);
    }
  }
}

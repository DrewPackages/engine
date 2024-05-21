export const EXECUTE_FROMULA_POSTFIX = (param?: object) =>
  `\n\ndeploy(${param != null ? JSON.stringify(param) : ""})`;
export const EXECUTE_FORMULA_PREFIX =
  "const api = this.Container.get(this.API_TOKEN)\n\n";

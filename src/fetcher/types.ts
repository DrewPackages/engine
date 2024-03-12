export interface IFormulaFetcher {
  fetchFormulaFileText(formulaRef: string, filePath: string): Promise<string>;
}

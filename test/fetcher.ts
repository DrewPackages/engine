import { readFile } from "fs/promises";
import { join, normalize } from "path";

export class TestsFetcher {
  async fetchFormulaFileText(
    formulaRef: string,
    filePath: string
  ): Promise<string> {
    const buffer = await readFile(
      normalize(join(__dirname, "formulas", formulaRef, filePath))
    );

    return buffer.toString("utf-8");
  }
}

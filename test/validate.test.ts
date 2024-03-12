import { validate } from "@src/validate";
import { TestsFetcher } from "./fetcher";
import Container from "typedi";

describe("Engine Validate", () => {
  afterEach(() => {
    Container.reset();
  });

  it("Should read steps", async () => {
    expect.assertions(3);
    const fetcher = new TestsFetcher();

    const script = await validate(
      { formulaName: "validate/2steps", values: {} },
      fetcher
    );

    expect(script).toHaveLength(2);
    expect(script[0].group).toEqual("wallet");
    expect(script[1].group).toEqual("hardhat");
  });

  it("Should reorder steps if needed", async () => {
    expect.assertions(3);
    const fetcher = new TestsFetcher();

    const script = await validate(
      { formulaName: "validate/2stepsReorder", values: {} },
      fetcher
    );

    expect(script).toHaveLength(2);
    expect(script[0].group).toEqual("wallet");
    expect(script[1].group).toEqual("hardhat");
  });
});

import { validate } from "@src/validate";
import { TestsFetcher } from "./fetcher";
import Container from "typedi";
import { UnknownApiError } from "@src/errors";

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

  it("Should throw an error on unknown api", async () => {
    expect.assertions(1);
    const fetcher = new TestsFetcher();

    const validation = validate(
      { formulaName: "validate/unknownApi", values: {} },
      fetcher
    );

    await expect(validation).rejects.toBeInstanceOf(UnknownApiError);
  });
});

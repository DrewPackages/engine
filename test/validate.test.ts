import "reflect-metadata";
import { Container } from "typedi";
import { validate, errors } from "../src";
import { TestsFetcher } from "./fetcher";
import { TestStorage } from "./state";

describe("Engine: Validate", () => {
  const fetcher = new TestsFetcher();
  let state: TestStorage;

  beforeEach(() => {
    state = new TestStorage();
  });
  afterEach(() => {
    Container.reset();
  });

  it("Should read steps", async () => {
    expect.assertions(3);

    const script = await validate(
      { formulaName: "validate/2steps" },
      fetcher,
      state
    );

    expect(script).toHaveLength(2);
    expect(script[0].group).toEqual("foundry");
    expect(script[1].group).toEqual("hardhat");
  });

  it("Should reorder steps if needed", async () => {
    expect.assertions(3);

    const script = await validate(
      { formulaName: "validate/2stepsReorder" },
      fetcher,
      state
    );

    expect(script).toHaveLength(2);
    expect(script[0].group).toEqual("foundry");
    expect(script[1].group).toEqual("hardhat");
  });

  it("Should throw an error on unknown api", async () => {
    expect.assertions(1);

    const validation = validate(
      { formulaName: "validate/unknownApi" },
      fetcher,
      state
    );

    await expect(validation).rejects.toBeInstanceOf(errors.UnknownApiError);
  });
});

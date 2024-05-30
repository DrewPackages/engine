import "reflect-metadata";
import { Container } from "typedi";
import { validate } from "../src";
import { TestsFetcher } from "./fetcher";
import { TestStorage } from "./state";

describe("Engine: State", () => {
  const fetcher = new TestsFetcher();
  let state: TestStorage;

  beforeEach(() => {
    state = new TestStorage();
  });
  afterEach(() => {
    jest.restoreAllMocks();
    Container.reset();
  });

  it("Should register outputs", async () => {
    jest.spyOn(state, "registerOutputs");

    const script = await validate(
      { formulaName: "state/withOutput" },
      fetcher,
      state
    );

    expect(script).toHaveLength(2);
    expect(script[0].group).toEqual("foundry");
    expect(script[1].group).toEqual("foundry");
    expect(script[1].args[0]).toHaveProperty("type", "scheduler-output");
    expect(state.registerOutputs).toHaveBeenCalledTimes(2);
  });
});

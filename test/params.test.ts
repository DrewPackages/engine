import Container from "typedi";
import { TestsFetcher } from "./fetcher";
import { addConfigs, readParamsSchema, validateParam } from "../src/params";
import { validate } from "../src";
import { ConfigRef } from "../src/params/config-refs";

describe("Engine: Params", () => {
  afterEach(() => {
    Container.reset();
  });

  it("Should validate required params with schema", async () => {
    const fetcher = new TestsFetcher();

    const formulaText = await fetcher.fetchFormulaFileText(
      "params/regularParams",
      "formula.js"
    );

    const params = {
      message: "0x123",
      iterations: 3,
    };

    const doReadParams = () => {
      const paramsSchema = readParamsSchema(formulaText);
      validateParam(params, paramsSchema);
      return paramsSchema;
    };

    expect(doReadParams).not.toThrow();
  });

  it("Should throw on invalid params", async () => {
    const fetcher = new TestsFetcher();

    const formulaText = await fetcher.fetchFormulaFileText(
      "params/regularParams",
      "formula.js"
    );

    const params = {
      message: "0x123",
      iterations: 0,
    };

    const doReadParams = () => {
      const paramsSchema = readParamsSchema(formulaText);
      validateParam(params, paramsSchema);
      return paramsSchema;
    };

    expect(doReadParams).toThrow();
  });

  it("Should throw on unknown params", async () => {
    const fetcher = new TestsFetcher();

    const formulaText = await fetcher.fetchFormulaFileText(
      "params/regularParams",
      "formula.js"
    );

    const params = {
      message: "0x123",
      iterations: 1,
      unknownProp: 0,
    };

    const doReadParams = () => {
      const paramsSchema = readParamsSchema(formulaText);
      validateParam(params, paramsSchema);
    };

    expect(doReadParams).toThrow();
  });

  it("Should throw on params without schema", async () => {
    const fetcher = new TestsFetcher();

    const formulaText = await fetcher.fetchFormulaFileText(
      "params/withoutParams",
      "formula.js"
    );

    const params = {
      message: "0x123",
      iterations: 1,
      unknownProp: 0,
    };

    const doReadParams = () => {
      const paramsSchema = readParamsSchema(formulaText);
      validateParam(params, paramsSchema);
    };

    expect(doReadParams).toThrow();
  });

  it("Should use params in formula", async () => {
    const fetcher = new TestsFetcher();

    const params = {
      message: "0x123",
      iterations: 3,
    };

    const steps = await validate(
      {
        formulaName: "params/regularParams",
        values: {},
      },
      fetcher,
      params
    );

    expect(steps).toHaveLength(3);
    expect(steps[0].method).toEqual("sign");
  });

  it("Should use optional params", async () => {
    const fetcher = new TestsFetcher();

    const params = {
      message: "0x123",
      iterations: 3,
      tail: true,
    };

    const steps = await validate(
      {
        formulaName: "params/regularParams",
        values: {},
      },
      fetcher,
      params
    );

    expect(steps).toHaveLength(4);
    expect(steps[3].method).toEqual("sign");
    expect(steps[3].args[0]).toEqual("tail");
  });

  it("Should execute formula without params", async () => {
    const fetcher = new TestsFetcher();

    const doValidate = async () => {
      return validate(
        {
          formulaName: "params/withoutParams",
          values: {},
        },
        fetcher
      );
    };

    await expect(doValidate()).resolves.toBeDefined();
  });

  describe("Config refs", () => {
    it("Should add config refs", async () => {
      const fetcher = new TestsFetcher();

      const steps = await validate(
        {
          formulaName: "params/withConfigRefs",
          values: {},
        },
        fetcher
      );

      expect(steps).toHaveLength(1);
      expect(steps[0].method).toEqual("sign");
      expect(steps[0].args[0]).toBeInstanceOf(ConfigRef);
      expect(steps[0].args[0]).toHaveProperty("group", "common");
      expect(steps[0].args[0]).toHaveProperty("key", "rpcUrl");
    });
  });
});

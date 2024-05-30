import { Container } from "typedi";
import {
  DeploymentHandler,
  FullHandler,
  UIHandler,
  setHandlers,
} from "./offchain-handlers";
import { TestsFetcher } from "./fetcher";
import { validate } from "../src";
import { TestStorage } from "./state";

describe("Engine: Offchain api", () => {
  let fullHandler: jest.MockedObjectDeep<FullHandler>;
  let uiHandler: jest.MockedObjectDeep<UIHandler>;
  let deploymentHandler: jest.MockedObjectDeep<DeploymentHandler>;
  const fetcher = new TestsFetcher();
  let state: TestStorage;

  function spy() {
    jest.spyOn(deploymentHandler, "isDeployParamValid");
    jest.spyOn(deploymentHandler, "deploy");
    jest.spyOn(deploymentHandler, "handlerName");
    jest.spyOn(deploymentHandler, "isDeploySupported");
    jest.spyOn(deploymentHandler, "isDeployUISupported");

    jest.spyOn(uiHandler, "isDeployUIParamValid");
    jest.spyOn(uiHandler, "deployUI");
    jest.spyOn(uiHandler, "handlerName");
    jest.spyOn(uiHandler, "isDeploySupported");
    jest.spyOn(uiHandler, "isDeployUISupported");

    jest.spyOn(fullHandler, "isDeployUIParamValid");
    jest.spyOn(fullHandler, "deployUI");
    jest.spyOn(fullHandler, "isDeployParamValid");
    jest.spyOn(fullHandler, "deploy");
    jest.spyOn(fullHandler, "handlerName");
    jest.spyOn(fullHandler, "isDeploySupported");
    jest.spyOn(fullHandler, "isDeployUISupported");
  }

  beforeAll(() => {
    setHandlers();

    fullHandler = Container.get("offchain-handler-full");
    uiHandler = Container.get("offchain-handler-ui");
    deploymentHandler = Container.get("offchain-handler-deployment");

    spy();
  });

  beforeEach(() => {
    state = new TestStorage();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    spy();
  });

  it("Should use unspecified deploy handler", async () => {
    await validate(
      {
        formulaName: "offchain/deploymentUnspecified",
        offchainHandlers: ["deployment"],
      },
      fetcher,
      state
    );

    expect(deploymentHandler.isDeployParamValid).toHaveBeenCalled();
    expect(deploymentHandler.deploy).toHaveBeenCalled();
  });

  it("Should use unspecified ui handler", async () => {
    await validate(
      {
        formulaName: "offchain/uiUnspecified",
        offchainHandlers: ["ui"],
      },
      fetcher,
      state
    );

    expect(uiHandler.isDeployUIParamValid).toHaveBeenCalled();
    expect(uiHandler.deployUI).toHaveBeenCalled();
  });

  it("Should use specified deploy handler", async () => {
    await validate(
      {
        formulaName: "offchain/deploymentSpecified",
        offchainHandlers: ["deployment"],
      },
      fetcher,
      state
    );

    expect(deploymentHandler.isDeployParamValid).toHaveBeenCalled();
    expect(deploymentHandler.deploy).toHaveBeenCalled();
  });

  it("Should use specified ui handler", async () => {
    await validate(
      {
        formulaName: "offchain/uiSpecified",
        offchainHandlers: ["ui"],
      },
      fetcher,
      state
    );

    expect(uiHandler.isDeployUIParamValid).toHaveBeenCalled();
    expect(uiHandler.deployUI).toHaveBeenCalled();
  });

  it("Should use ui handler when available", async () => {
    await validate(
      {
        formulaName: "offchain/checkUiAvailability",
        offchainHandlers: ["ui"],
      },
      fetcher,
      state
    );

    expect(uiHandler.isDeployUIParamValid).toHaveBeenCalled();
    expect(uiHandler.deployUI).toHaveBeenCalled();
  });

  it("Shouldn't use ui handler when not available", async () => {
    await validate(
      {
        formulaName: "offchain/checkUiAvailability",
        offchainHandlers: ["deployment"],
      },
      fetcher,
      state
    );

    expect(uiHandler.isDeployUIParamValid).not.toHaveBeenCalled();
    expect(uiHandler.deployUI).not.toHaveBeenCalled();
  });

  it("Should fail when handler doesn't support an operation", async () => {
    await expect(
      validate(
        {
          formulaName: "offchain/uiSpecifiedToWrongHandler",
          apis: [],
          offchainHandlers: ["deployment", "ui"],
        },
        fetcher,
        state
      )
    ).rejects.toThrow();

    expect(deploymentHandler.isDeployUISupported).toHaveBeenCalled();

    await expect(
      validate(
        {
          formulaName: "offchain/deploymentSpecifiedToWrongHandler",
          apis: [],
          offchainHandlers: ["deployment", "ui"],
        },
        fetcher,
        state
      )
    ).rejects.toThrow();

    expect(uiHandler.isDeploySupported).toHaveBeenCalled();
  });

  it("Should fail when ui handler doesn't support an operation params", async () => {
    await expect(
      validate(
        {
          formulaName: "offchain/uiSpecifiedWithWrongParam",
          apis: [],
          offchainHandlers: ["deployment", "ui"],
        },
        fetcher,
        state
      )
    ).rejects.toThrow();

    expect(uiHandler.isDeployUISupported).toHaveBeenCalled();
    expect(uiHandler.isDeployUIParamValid).toHaveReturnedWith(false);
  });

  it("Should fail when deployment handler doesn't support an operation params", async () => {
    await expect(
      validate(
        {
          formulaName: "offchain/deploymentSpecifiedToWrongHandler",
          apis: [],
          offchainHandlers: ["deployment", "ui"],
        },
        fetcher,
        state
      )
    ).rejects.toThrow();

    expect(uiHandler.isDeploySupported).toHaveBeenCalled();
  });
});

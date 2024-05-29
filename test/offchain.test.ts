import { Container } from "typedi";
import {
  DeploymentHandler,
  FullHandler,
  UIHandler,
  setHandlers,
} from "./offchain-handlers";
import { TestsFetcher } from "./fetcher";
import { validate } from "../src";

describe("Offchain api", () => {
  let fullHandler: jest.MockedObjectDeep<FullHandler>;
  let uiHandler: jest.MockedObjectDeep<UIHandler>;
  let deploymentHandler: jest.MockedObjectDeep<DeploymentHandler>;
  const fetcher = new TestsFetcher();

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
      fetcher
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
      fetcher
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
      fetcher
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
      fetcher
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
      fetcher
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
      fetcher
    );

    expect(uiHandler.isDeployUIParamValid).not.toHaveBeenCalled();
    expect(uiHandler.deployUI).not.toHaveBeenCalled();
  });
});

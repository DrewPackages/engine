import { Container } from "typedi";
import { IOffchainApi } from "../src/api/offchain";

export class FullHandler implements IOffchainApi {
  handlerName(): string {
    return "full-offchain";
  }

  isDeployParamValid(details: object): boolean {
    return (
      "a" in details &&
      "b" in details &&
      typeof details.a === typeof details.b &&
      typeof details.a === "string"
    );
  }

  deploy(details: object) {}

  deployUI(details: object) {}

  isDeploySupported(): boolean {
    return true;
  }

  isDeployUISupported(): boolean {
    return true;
  }

  isDeployUIParamValid(details: object): boolean {
    return (
      "c" in details &&
      "d" in details &&
      typeof details.c === typeof details.d &&
      typeof details.c === "string"
    );
  }
}

export class DeploymentHandler implements IOffchainApi {
  handlerName(): string {
    return "deployment-offchain";
  }

  isDeployParamValid(details: object): boolean {
    return (
      "a" in details &&
      "b" in details &&
      typeof details.a === typeof details.b &&
      typeof details.a === "string"
    );
  }

  deploy(details: object) {}

  isDeploySupported(): boolean {
    return true;
  }

  isDeployUISupported(): boolean {
    return false;
  }
}

export class UIHandler implements IOffchainApi {
  handlerName(): string {
    return "ui-offchain";
  }

  deployUI(details: object) {}

  isDeploySupported(): boolean {
    return false;
  }

  isDeployUISupported(): boolean {
    return true;
  }

  isDeployUIParamValid(details: object): boolean {
    return (
      "c" in details &&
      "d" in details &&
      typeof details.c === typeof details.d &&
      typeof details.c === "string"
    );
  }
}
export function setHandlers() {
  Container.set("offchain-handler-full", new FullHandler());
  Container.set("offchain-handler-deployment", new DeploymentHandler());
  Container.set("offchain-handler-ui", new UIHandler());
}

import { Container } from "typedi";

import {
  OffchainHandlerNotFound,
  OperationNotSupportedByOffchainHandler,
  OperationNotSupportedByOffchainHandlers,
} from "./errors";
import { DeployOffchainTask, IOffchainApi } from "./types";

export class OffchainApi {
  private readonly handlers: Array<IOffchainApi> = [];
  constructor(apis: Array<string>) {
    apis.forEach((api) => {
      const handler = Container.get<IOffchainApi>(`offchain-handler-${api}`);
      if (!handler) {
        throw new OffchainHandlerNotFound(api);
      }
      this.handlers.push(handler);
    });
  }

  get isUIDeployable(): boolean {
    return this.handlers.findIndex((a) => a.isDeployUISupported) !== -1;
  }

  private getHandlerByType(handlerName: string): IOffchainApi {
    const found = this.handlers.find((a) => a.handlerName === handlerName);
    if (!found) {
      throw new OffchainHandlerNotFound(handlerName);
    }
    return found;
  }

  async deploy(task: DeployOffchainTask): Promise<void> {
    let handler: IOffchainApi;
    if (task.handlerType) {
      handler = this.getHandlerByType(task.handlerType);
      if (!handler.isDeploySupported) {
        throw new OperationNotSupportedByOffchainHandler(
          task.handlerType,
          "deploy"
        );
      }
    } else {
      const supported = this.handlers.filter(
        (a) =>
          a.isDeploySupported && a.isDeployParamValid(task.deploymentDetails)
      );
      if (supported.length === 0) {
        throw new OperationNotSupportedByOffchainHandlers("deploy");
      }
      handler = supported[0];
    }
    await handler.deploy(task.deploymentDetails);
  }

  async ui(task: DeployOffchainTask): Promise<void> {
    let handler: IOffchainApi;
    if (task.handlerType) {
      handler = this.getHandlerByType(task.handlerType);
      if (!handler.isDeployUISupported) {
        throw new OperationNotSupportedByOffchainHandler(
          task.handlerType,
          "ui"
        );
      }
    } else {
      const supported = this.handlers.filter(
        (a) =>
          a.isDeployUISupported &&
          a.isDeployUIParamValid(task.deploymentDetails)
      );
      if (supported.length === 0) {
        throw new OperationNotSupportedByOffchainHandlers("ui");
      }
      handler = supported[0];
    }
    await handler.deployUI(task.deploymentDetails);
  }
}

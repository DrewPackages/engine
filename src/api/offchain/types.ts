export type DeployOffchainTask = {
  type: "deploy";
  handlerType?: string;
  details: object;
};

export type DeployUITask = {
  type: "ui";
  handlerType?: string;
  details: object;
};

export interface IOffchainOperationSupported {
  isDeploySupported(): boolean;
  isDeployUISupported(): boolean;
  handlerName(): string;
}

export interface IOffchainDeployApi {
  isDeployParamValid(details: object): boolean;
  deploy(details: object): void;
}

export interface IOffchainDeployUIApi {
  isDeployUIParamValid(details: object): boolean;
  deployUI(details: object): void;
}

export type IOffchainApi = IOffchainOperationSupported &
  Partial<IOffchainDeployApi & IOffchainDeployUIApi>;

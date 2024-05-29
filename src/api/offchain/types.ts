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
  get isDeploySupported(): boolean;
  get isDeployUISupported(): boolean;
  get handlerName(): string;
}

export interface IOffchainDeployApi {
  isDeployParamValid(details: object): boolean;
  deploy(details: object): Promise<void>;
}

export interface IOffchainDeployUIApi {
  isDeployUIParamValid(details: object): boolean;
  deployUI(details: object): Promise<void>;
}

export type IOffchainApi = IOffchainOperationSupported &
  Partial<IOffchainDeployApi & IOffchainDeployUIApi>;

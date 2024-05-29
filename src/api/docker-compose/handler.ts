import { IQueue, QUEUE_TOKEN } from "../../queue/types";
import { BaseScheduler } from "../scheduler";
import { Inject, Service } from "typedi";
import { IOffchainApi } from "../offchain";
import z from "zod";
import { ConfigRefSchema } from "../../params";

export const DeployRequestDetailsSchema = z.object({
  path: z.string().or(ConfigRefSchema).optional(),
  envs: z.record(z.string(), z.string().or(ConfigRefSchema)).optional(),
});

type IDeployRequestDetails = z.infer<typeof DeployRequestDetailsSchema>;

@Service("offchain-handler-docker-compose")
export class DockerComposeScheduler
  extends BaseScheduler
  implements IOffchainApi
{
  constructor(@Inject(QUEUE_TOKEN) queue: IQueue) {
    super(queue, "dockerCompose", "offchain");
  }

  get handlerName(): string {
    return "docker-compose";
  }

  get isDeploySupported(): boolean {
    return true;
  }

  get isDeployUISupported(): boolean {
    return false;
  }

  isDeployParamValid(details: object): boolean {
    const result = DeployRequestDetailsSchema.safeParse(details);
    return result.success;
  }

  async deploy(details: object): Promise<void> {
    const parsedDetails = DeployRequestDetailsSchema.parse(details);
    this.up(parsedDetails);
  }

  private up(arg: IDeployRequestDetails) {
    this.schedule(
      "up",
      [arg.path || "docker-compose.yaml", arg.envs || {}],
      {}
    );
  }
}

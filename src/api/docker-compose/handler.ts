import { IQueue, QUEUE_TOKEN } from "../../queue/types";
import { BaseScheduler } from "../scheduler";
import { Inject, Service } from "typedi";
import { IOffchainApi } from "../offchain";
import z from "zod";
import { ConfigRefSchema } from "../../params";
import { SchedulerOutputSchema } from "../../state";

export const DeployRequestDetailsSchema = z.object({
  path: z.string().or(ConfigRefSchema).optional(),
  envs: z
    .record(
      z.string(),
      z.string().or(ConfigRefSchema).or(SchedulerOutputSchema).optional()
    )
    .optional(),
  flags: z
    .object({
      build: z.boolean(),
    })
    .partial()
    .optional(),
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

  handlerName(): string {
    return "docker-compose";
  }

  isDeploySupported(): boolean {
    return true;
  }

  isDeployUISupported(): boolean {
    return false;
  }

  isDeployParamValid(details: object): boolean {
    const result = DeployRequestDetailsSchema.safeParse(details);
    return result.success;
  }

  deploy(details: object) {
    const parsedDetails = DeployRequestDetailsSchema.parse(details);
    this.up(parsedDetails);
  }

  private up(arg: IDeployRequestDetails) {
    this.schedule(
      "up",
      [arg.path || "docker-compose.yaml", arg.envs || {}],
      {
        build: arg?.flags?.build || false,
      },
      "offchain",
      [
        {
          name: "containerIds",
          extract: {
            type: "regex",
            expr: "CONTAINER ID\n(?<containerIds>([a-f0-9]+\n?)*)",
            groupName: "containerIds",
          },
        },
      ]
    );
  }
}

import { DrewError } from "../errors";

export class ScheduleOuputNotReceivedYet extends DrewError {
  constructor(outputId: string) {
    super(`Output with id '${outputId}' not received yet`, "execute");
  }
}

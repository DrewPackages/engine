import { OutputExtract } from "../api/types";
import z from "zod";

export type ScheduleOutput = {
  type: "scheduler-output";
  id: string;
  extract?: OutputExtract;
};

export const SchedulerOutputSchema = z.object({
  type: z.literal("scheduler-output"),
  id: z.string(),
  extract: z
    .object({
      type: z.string(),
    })
    .optional(),
});

export function isScheduleOutput(smtn: any): smtn is ScheduleOutput {
  return SchedulerOutputSchema.safeParse(smtn).success;
}

export type IStateStorageRegistrer = {
  registerOutputs(outputs: Array<ScheduleOutput>);
};

export type IStateStorageFetcher = {
  isOutputResolved(outputId: string): boolean;
  getOutputValue<T>(outputId: string): T;
};

export type IStateStorage = IStateStorageRegistrer & IStateStorageFetcher;

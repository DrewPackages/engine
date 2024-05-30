import { Token } from "typedi";
import { IStateStorage } from "./types";

export const STATE_STORAGE_TOKEN = new Token<IStateStorage>("STATE_STORAGE");

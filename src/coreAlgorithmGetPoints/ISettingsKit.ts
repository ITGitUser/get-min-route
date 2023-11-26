import { Claster } from "./Claster";
import { IPoint } from "./IPoint";

export interface ISettingsKit {
  k: number;
  deepReduct: number;
  stoppingConditions(claster: Claster): boolean;
  SolveInternalTask(claster: Claster): void;
}

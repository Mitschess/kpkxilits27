import type { Faculty } from "./types";
import { FSAD } from "./fsad";
import { FTIRS } from "./ftirs";
import { FTSPK } from "./ftspk";
import { FTK } from "./ftk";
import { FTEIC } from "./fteic";
import { FKK } from "./fkk";
import { FDKBD } from "./fdkbd";
import { FV } from "./fv";

export type { Faculty, Department, Competition } from "./types";

export const FACULTIES: Faculty[] = [FSAD, FTIRS, FTSPK, FTK, FTEIC, FKK, FDKBD, FV];

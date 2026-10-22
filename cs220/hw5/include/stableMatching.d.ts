export interface Hire {
  company: number;
  candidate: number;
}

export interface Offer {
  from: number;
  to: number;
  fromCo: boolean;
}

export interface Run {
  trace: Offer[];
  out: Hire[];
}

export type StableMatcherWithTrace = (companies: number[][], candidates: number[][]) => Run;

export const STABLE_MATCHING_SOLUTION_1_TRACE: StableMatcherWithTrace;
export const FLAWED_STABLE_MATCHING_SOLUTION_1_TRACE: StableMatcherWithTrace;

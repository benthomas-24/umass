import assert from "assert";

import type { StableMatcherWithTrace, Offer, Hire } from "../include/stableMatching.js";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function range(start: number, stop?: number, step = 1): number[] {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }

  if (step === 0) return [];

  const length = Math.max(Math.ceil((stop - start) / step), 0);

  return Array.from({ length }, (_, i) => start + i * step);
}

export function generateInput(n: number): number[][] {
  const sol: number[][] = Array.from({ length: n }, () => range(n));
  for (let row = 0; row < n; row++) {
    for (let i = n - 1; i > 0; i--) {
      const j = randomInt(0, i);
      const temp = sol[row][i];
      sol[row][i] = sol[row][j];
      sol[row][j] = temp;
    }
  }
  return sol;
}

const NUM_TESTS = 100; // Change this to some reasonably large value
const N = 6; // Change this to some reasonable size

/**
 * Tests whether or not the supplied function follows the supplied algorithm.
 * @param makeStableMatchingTrace A possible solution to the stable matching problem and its possible steps
 * @throws An `AssertionError` if `makeStableMatchingTrace` does not follow the specified algorithm, or its steps (trace)
 * do not match with the result (out).
 */
const hasUniqueMatches = (x: Hire[]): boolean => {
  const companies = new Set<number>();
  const candidates = new Set<number>();
  for (const hire of x) {
    if (companies.has(hire.company) || candidates.has(hire.candidate)) {
      return false;
    }
    companies.add(hire.company);
    candidates.add(hire.candidate);
  }
  return true;
};

const assertValidId = (id: number): void => {
  assert(Number.isInteger(id) && id >= 0 && id < N, "Participant ID must be an integer between 0 and N - 1");
};

const correctValues = (items: Offer[] | Hire[]): void => {
  for (const item of items) {
    if ("from" in item) {
      assertValidId(item.from);
      assertValidId(item.to);
      assert(typeof item.fromCo === "boolean", "fromCo must be a boolean");
    } else {
      assertValidId(item.company);
      assertValidId(item.candidate);
    }
  }
};
export function stableMatchingRunOracle(makeStableMatchingTrace: StableMatcherWithTrace): void {
  for (let i = 0; i < NUM_TESTS; ++i) {
    const companies = generateInput(N);
    const candidates = generateInput(N);
    console.log("companies: ", companies);
    console.log("candidates: ", candidates);
    const { trace, out } = makeStableMatchingTrace(companies, candidates);

    assert(hasUniqueMatches(out), "A company or candidate appears in more than one match");
    assert(out.length <= N, "There are more matches than available participants");
    correctValues(trace);
    correctValues(out);

    const companyMatch: number[] = Array<number>(N).fill(-1);
    const candidateMatch: number[] = Array<number>(N).fill(-1);
    const companyNextOffer = Array<number>(N).fill(0);
    const candidateNextOffer = Array<number>(N).fill(0);
    for (const offer of trace) {
      const proposerMatches = offer.fromCo ? companyMatch : candidateMatch;
      const receiverMatches = offer.fromCo ? candidateMatch : companyMatch;
      const receiverPreferences = offer.fromCo ? candidates : companies;
      const proposerPreferences = offer.fromCo ? companies : candidates;
      const nextOffer = offer.fromCo ? companyNextOffer : candidateNextOffer;
      const proposer = offer.from;
      const receiver = offer.to;

      assert(proposerMatches[proposer] === -1, "A matched participant cannot propose");
      assert(
        receiver === proposerPreferences[proposer][nextOffer[proposer]],
        "A proposer must approach their next preference without skipping or repeating"
      );
      nextOffer[proposer] += 1;

      const currentPartner = receiverMatches[receiver];
      const preferences = receiverPreferences[receiver];

      const accepts = currentPartner === -1 || preferences.indexOf(proposer) < preferences.indexOf(currentPartner);
      if (accepts) {
        if (currentPartner !== -1) {
          proposerMatches[currentPartner] = -1;
        }
        proposerMatches[proposer] = receiver;
        receiverMatches[receiver] = proposer;
      }
    }
    const matchedCount = companyMatch.filter(candidate => candidate !== -1).length;
    assert(out.length === matchedCount, "out must contain every match produced by the trace");
    for (const hire of out) {
      assert(companyMatch[hire.company] === hire.candidate, "A pair in out does not match the result of the trace");
    }
  }
}

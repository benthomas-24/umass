import { AssertionError } from "assert";
import {
  FLAWED_STABLE_MATCHING_SOLUTION_1_TRACE,
  STABLE_MATCHING_SOLUTION_1_TRACE,
} from "../include/stableMatching.js";
import { stableMatchingRunOracle } from "./oracles.js";

describe("generateInput", () => {
  // Tests for generateInput go here.
});

describe("stableMatchingRunOracle", () => {
  // You do not need to write more tests than the two provided

  // Given an correct solution, no assertion should fail, and no errors should be thrown
  it("should accept STABLE_MATCHING_SOLUTION_1_TRACE", () => {
    expect(() => stableMatchingRunOracle(STABLE_MATCHING_SOLUTION_1_TRACE)).not.toThrow();
  });

  // Given an incorrect solution, some assertion should fail
  it("should reject FLAWED_STABLE_MATCHING_SOLUTION_1", () => {
    expect(() => stableMatchingRunOracle(FLAWED_STABLE_MATCHING_SOLUTION_1_TRACE)).toThrow(AssertionError);
  });
});

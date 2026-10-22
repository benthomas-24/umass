import assert from "assert";
import { Reader, NewspaperApp } from "./lab.js";

const makeTestReader = (): Reader => ({ alert: jest.fn() });

describe("NewspaperApp", () => {
  let newspaperApp: NewspaperApp;
  let reader1: Reader;
  let reader2: Reader;

  beforeEach(() => {
    newspaperApp = new NewspaperApp();
    reader1 = makeTestReader();
    reader2 = makeTestReader();

    newspaperApp.subscribe(reader1, true);
    newspaperApp.subscribe(reader2, false);
  });

  it("sends breaking news to all subscribers", () => {
    newspaperApp.newHeadline("Breaking headline", "breaking");

    expect(reader1.alert).toHaveBeenCalledWith("Breaking headline");
    expect(reader2.alert).toHaveBeenCalledWith("Breaking headline");
  });

  it("sends tech news only to opted-in subscribers", () => {
    newspaperApp.newHeadline("Tech headline", "technology");

    expect(reader1.alert).toHaveBeenCalledWith("Tech headline");
    expect(reader2.alert).not.toHaveBeenCalled();
  });

  it("stops all alerts after unsubscribe", () => {
    newspaperApp.unsubscribe(reader1);

    newspaperApp.newHeadline("Breaking headline", "breaking");
    newspaperApp.newHeadline("Tech headline", "technology");

    expect(reader1.alert).not.toHaveBeenCalled();
  });

  it("stops only tech alerts after unsubscribeFromTechNews", () => {
    newspaperApp.unsubscribeFromTechNews(reader1);

    newspaperApp.newHeadline("Breaking headline", "breaking");
    newspaperApp.newHeadline("Tech headline", "technology");

    expect(reader1.alert).toHaveBeenCalledTimes(1);
    expect(reader1.alert).toHaveBeenCalledWith("Breaking headline");
  });

  it("does not alert the same subscriber twice if subscribed twice", () => {
    newspaperApp.subscribe(reader1, true);

    newspaperApp.newHeadline("Breaking headline", "breaking");

    expect(reader1.alert).toHaveBeenCalledTimes(1);
  });
});

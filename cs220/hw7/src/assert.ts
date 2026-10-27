// https://blog.logrocket.com/assertion-functions-typescript/#:~:text=Assertion%20functions%20in%20TypeScript%20are,For%20example%2C%20Node.
export function assert(condition: unknown, msg?: string): asserts condition {
  if (condition === false) {
    throw new Error(msg);
  }
}

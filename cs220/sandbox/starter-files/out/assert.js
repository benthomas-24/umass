// https://blog.logrocket.com/assertion-functions-typescript/#:~:text=Assertion%20functions%20in%20TypeScript%20are,For%20example%2C%20Node.
export function assert(condition, msg) {
    if (condition === false) {
        throw new Error(msg);
    }
}
//# sourceMappingURL=assert.js.map
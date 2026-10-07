function makeCounter(tally: { total: number }) {
  let count = 1;

  return () => {
    tally.total++;
    return count++;
  };
}

const tally = { total: 0 };

const counter1 = makeCounter(tally);
const counter2 = makeCounter(tally);

const x = counter1();
const y = counter1();
const z = counter2();

console.log(x);

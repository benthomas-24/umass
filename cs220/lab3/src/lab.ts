// Exercise 1: Mental Models (see slides and worksheet)

// Exercise 2: Closures
export function factorialSum(): () => number {
  let n = 1,
    factorial = 1,
    sum = 0;

  return () => {
    factorial *= n++;
    sum += factorial;
    return sum;
  };
}

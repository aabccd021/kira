export function helloWorld(x: number): number {
  if (x > 1000) return 100;
  return x + 1;
}

const result = helloWorld(2);
console.log(result);

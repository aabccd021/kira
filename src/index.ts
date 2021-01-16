export function helloWorld(x: number): number {
  if (x > 100) return 100;
  return x + 1;
}

const result = helloWorld(2);
console.log(result);

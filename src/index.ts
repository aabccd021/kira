export function helloWorld(x: number): number {
  if (x > 100) return haroWarudo(x);
  return x + 1;
}

function haroWarudo(x: number): number {
  return x + 2;
}

const result = helloWorld(2);
console.log(result);

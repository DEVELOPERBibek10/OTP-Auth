export function ConvertToNumber(input: string): number {
  const result = isFinite(parseInt(input)) ? parseInt(input) : 0;
  return result;
}

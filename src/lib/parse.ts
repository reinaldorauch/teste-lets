export const parseInteger = (maybeNumber: string | number, def = 0): number => {
  let num = +(maybeNumber ?? def);
  return Number.isNaN(num) ? def : num;
}

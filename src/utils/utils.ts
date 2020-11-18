export const formatAccountString = (account: string | undefined): string => {
  let start = account?.slice(0, 8);
  let end = account?.slice(-10);
  return start + "....." + end;
};

export const cleanDecimal = (num: number, power: number) => {
  let MUL_DIV = 100;
  if (power || power === 0) {
    MUL_DIV = 10 ** power;
  } else {
    if (num < 0.01) MUL_DIV = 10 ** 6;
    if (num < 1) MUL_DIV = 10 ** 4;
  }
  return Math.floor(Number(num) * MUL_DIV) / MUL_DIV;
};

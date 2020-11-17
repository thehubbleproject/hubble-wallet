export const formatAccountString = (account: string | undefined): string => {
  let start = account?.slice(0, 8);
  let end = account?.slice(-10);
  return start + "....." + end;
};

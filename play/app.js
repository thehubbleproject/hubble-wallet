const func = async () => {
  return Promise.resolve("K");
};

const funcB = () => {
  return func().then((v) => v);
};

console.log(funcB());

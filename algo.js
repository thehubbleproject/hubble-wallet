const ethers = require("ethers");

const generateSplitTransactions = (amount, states) => {
  let transactions = [];
  let remaininingAmount = amount;

  try {
    // 1. sort the state by ID
    let states_sorted = states.sort((a, b) => b.balance - a.balance);

    while (remaininingAmount > 0) {
      // 2. check if the amount can be reduced from first account
      let currentState = states_sorted[0];

      let amountPossible = 0;
      // 3.1 check if amount can be reduced
      if (currentState.balance > amount) {
        amountPossible = remaininingAmount;
      } else {
        amountPossible = Math.min(currentState.balance, remaininingAmount);
        // 3.2 calculate difference
      }

      let transaction_N = {
        amountPossible,
        state_id: currentState.state_id,
      };

      transactions.push(transaction_N);
      remaininingAmount -= amountPossible;

      // 4. remove the current state from array
      states_sorted.shift();
    }
    // 5. return if amount is 0
    return transactions;
  } catch (error) {
    return [];
  }
};

let states = [
  {
    balance: 19,
    state_id: 0,
    token_id: 0,
    nonce: 1,
  },
  {
    balance: 20,
    state_id: 1,
    token_id: 0,
    nonce: 0,
  },
  {
    balance: 20,
    state_id: 2,
    token_id: 0,
    nonce: 0,
  },
];

console.log(generateSplitTransactions(20, states));

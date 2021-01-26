import { AbiCoder } from "ethers/lib/utils";
import * as mcl from "react-hubble-bls/dist/mcl";

import { cleanDecimal } from "../utils/utils";

import { useStoreState, useStoreActions } from "../store/globalStore";

import DepositManagerContract from "../contracts/DepositManagerContract.json";
import BLSAccountRegistryContract from "../contracts/BLSAccountRegistryContract.json";
import TestTokenContract from "../contracts/TestTokenContract.json";

const useContracts = () => {
  const { web3, account } = useStoreState((state) => state);
  const { updateCurrentAccount, setShouldUpdate } = useStoreActions(
    (action) => action
  );

  const approveToken = async () => {
    let maxValue =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    let TestTokenContractInstance = new web3.eth.Contract(
      TestTokenContract.abi,
      TestTokenContract.address
    );

    TestTokenContractInstance.methods
      .approve(DepositManagerContract.address, maxValue)
      .send({
        from: account,
      })
      .on("transactionHash", function (hash: any) {
        console.log(hash);
      })
      .on("receipt", function (receipt: any) {
        console.log(receipt);
        setShouldUpdate(true);
      });
  };

  const checkBalance = async () => {
    let TestTokenContractInstance = new web3.eth.Contract(
      TestTokenContract.abi,
      TestTokenContract.address
    );

    let bal = await TestTokenContractInstance.methods.balanceOf(account).call();
    bal = bal > 0 ? cleanDecimal(bal / 10 ** 8, 2) : 0;

    return bal;
  };

  const checkAllowance = async () => {
    let TestTokenContractInstance = new web3.eth.Contract(
      TestTokenContract.abi,
      TestTokenContract.address
    );

    let allowance = await TestTokenContractInstance.methods
      .allowance(account, DepositManagerContract.address)
      .call();
    // console.log(allowance);
    if (allowance > 0) {
      return true;
    } else {
      return false;
    }
  };

  const performDeposit = async (blsAddress: string, amount: number) => {
    let DepositManagerContractInstance = new web3.eth.Contract(
      DepositManagerContract.abi,
      DepositManagerContract.address
    );

    let valueInWei = String((Number(amount) * 10 ** 18).toFixed(0));

    DepositManagerContractInstance.methods
      .depositFor(blsAddress, valueInWei, 0)
      .send({
        from: account,
      })
      .on("transactionHash", function (hash: any) {
        console.log(hash);
      })
      .on("receipt", function (receipt: any) {
        console.log(receipt);
        setShouldUpdate(true);
      });
  };

  const createNewBLSAccountRegistry = async (pubkey: mcl.PublicKey) => {
    let BLSAccountRegistryContractInstance = new web3.eth.Contract(
      BLSAccountRegistryContract.abi,
      BLSAccountRegistryContract.address
    );

    BLSAccountRegistryContractInstance.methods
      .register(pubkey)
      .send({
        from: account,
      })
      .on("transactionHash", function (hash: any) {
        console.log(hash);
      })
      .on("receipt", function (receipt: any) {
        let decoder = new AbiCoder();
        let decoded = decoder.decode(
          ["uint256[4]", "uint256"],
          receipt.events[0].raw.data
        );
        updateCurrentAccount(decoded[1]._hex);
      });
  };

  return {
    approveToken,
    checkAllowance,
    performDeposit,
    createNewBLSAccountRegistry,
    checkBalance,
  };
};

export default useContracts;

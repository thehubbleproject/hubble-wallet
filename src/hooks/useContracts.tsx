import { ethers } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import * as mcl from "react-hubble-bls/dist/mcl";

import { AddressesList } from "../utils/addresses";
import { cleanDecimal } from "../utils/utils";

import { useStoreState, useStoreActions } from "../store/globalStore";

import DepositManagerContract from "../contracts/DepositManagerContract.json";
import BLSAccountRegistryContract from "../contracts/BLSAccountRegistryContract.json";
import TestTokenContract from "../contracts/TestTokenContract.json";

const useContracts = () => {
  const { web3, account } = useStoreState((state) => state);
  const { updateCurrentAccount } = useStoreActions((action) => action);

  const approveToken = async () => {
    let maxValue =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    let TestTokenContractInstance = new web3.eth.Contract(
      TestTokenContract.abi,
      TestTokenContract.address
    );

    TestTokenContractInstance.methods
      .approve(AddressesList.tokens.test_hubble.toLowerCase(), maxValue)
      .send({
        from: account,
      })
      .on("transactionHash", function (hash: any) {
        console.log(hash);
      })
      .on("receipt", function (receipt: any) {
        console.log(receipt);
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
      .allowance(account, AddressesList.tokens.test_hubble.toLowerCase())
      .call();
    if (allowance > 0) {
      return true;
    } else {
      return false;
    }
  };

  const performDeposit = async () => {
    let DepositManagerContractInstance = new web3.eth.Contract(
      DepositManagerContract.abi,
      DepositManagerContract.address
    );

    DepositManagerContractInstance.methods
      .depositFor(100, 100, 1)
      .send({
        from: account,
      })
      .on("transactionHash", function (hash: any) {
        console.log(hash);
      })
      .on("confirmation", function (confirmationNumber: any, receipt: any) {
        console.log(receipt);
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
        console.log(parseInt(decoded[1]));
        updateCurrentAccount(decoded[1].hex);
      });
  };

  return {
    approveToken,
    checkAllowance,
    performDeposit,
    createNewBLSAccountRegistry,
  };
};

export default useContracts;

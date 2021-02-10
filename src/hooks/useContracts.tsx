import { AbiCoder } from "ethers/lib/utils";
import * as mcl from "@thehubbleproject/bls/dist/mcl";

import { useStoreState, useStoreActions } from "../store/globalStore";

import DepositManagerContract from "../contracts/DepositManagerContract.json";
import BLSAccountRegistryContract from "../contracts/BLSAccountRegistryContract.json";
import TestTokenContract from "../contracts/TestTokenContract.json";
import Rollup from "../contracts/Rollup.json";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const useContracts = () => {
  const { account, web3 } = useStoreState((state) => state);
  const { updateCurrentAccount, setShouldUpdate } = useStoreActions(
    (action) => action
  );

  const getAppId = async () => {
    let RollupContractInstance = new web3.eth.Contract(
      Rollup.abi,
      Rollup.address
    );

    return await RollupContractInstance.methods.appID().call();
  };

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
        Swal.fire("Tx Submitted", hash, "success");
      })
      .on("receipt", function (receipt: any) {
        toast(`Approve Token Tx confirmed`);
        setShouldUpdate(true);
      });
  };

  const checkBalance = async () => {
    let TestTokenContractInstance = new web3.eth.Contract(
      TestTokenContract.abi,
      TestTokenContract.address
    );

    let bal = await TestTokenContractInstance.methods.balanceOf(account).call();
    bal = bal > 0 ? web3.utils.fromWei(bal.toString()) : 0;
    return bal;
  };

  const checkAllowance = async (tokenAddress: string) => {
    let TestTokenContractInstance = new web3.eth.Contract(
      TestTokenContract.abi,
      tokenAddress
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

    let valueInWei = String(Number(amount) * 10 ** 18);

    DepositManagerContractInstance.methods
      .depositFor(blsAddress, valueInWei, 0)
      .send({
        from: account,
      })
      .on("transactionHash", function (hash: any) {
        Swal.fire("Tx Submitted", hash, "success");
      })
      .on("receipt", function (receipt: any) {
        toast(`Deposit Tx confirmed`);
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
        Swal.fire("Tx Submitted", hash, "success");
      })
      .on("receipt", function (receipt: any) {
        toast(`New Account registration Tx confirmed`);
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
    getAppId,
  };
};

export default useContracts;

import * as mcl from "@thehubbleproject/bls/dist/mcl";
import { ethers } from "ethers";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useStoreState, useStoreActions } from "../store/globalStore";

import {
  BLSAccountRegistry__factory,
  CustomToken__factory,
  DepositManager__factory,
} from "../contracts/types/";
import config from "../config";



/**
 * provides utilities to interact with the rollup contract
 */
const useContracts = () => {
  const { account } = useStoreState((state) => state);
  const { updateCurrentAccount, setShouldUpdate } = useStoreActions(
    (action) => action
  );

  /**
   * registers an L2 address on the L1 and connects them together
   * @param pubkey reduced pubkey of the L2 account
   */
  const createNewBLSAccountRegistry = async (pubkey: mcl.PublicKey) => {
    const BLSAccountRegistry = new BLSAccountRegistry__factory(account).attach(
      config.GENESIS.addresses.blsAccountRegistry
    );

    const tx = await BLSAccountRegistry.register(pubkey);
    Swal.fire("Tx Submitted", tx.hash, "success");

    const receipt = await tx.wait(1);
    toast.success(`New Account registration Tx confirmed`);

    const [event] = await BLSAccountRegistry.queryFilter(
      BLSAccountRegistry.filters.SinglePubkeyRegistered(),
      receipt.blockHash
    );

    updateCurrentAccount(ethers.BigNumber.from(event.data).toString());
  };

  /**
   * deposits tokens from L1 account into the L2 account
   *
   * @param pubkeyId index received from contract when registering pubkey
   * @param amount amount of tokens to deposit
   */
  const performDeposit = async (pubkeyId: string, amount: number) => {
    let DepositManager = new DepositManager__factory(account).attach(
      config.GENESIS.addresses.depositManager
    );

    let depositAmount = ethers.utils.parseEther(amount.toString());

    const tx = await DepositManager.depositFor(pubkeyId, depositAmount, 0);
    Swal.fire("Tx Submitted", tx.hash, "success");

    await tx.wait(1);
    toast.success(`Deposit Tx confirmed`);
    setShouldUpdate(true);
  };

  /**
   * checks the spending limit of the contract as approved by the
   * token holder
   * @param tokenAddress address of the deployed ERC20 token contract
   */
  const checkAllowance = async (tokenAddress: string) => {
    let Token = new CustomToken__factory(account).attach(
      config.GENESIS.addresses.exampleToken
    );

    let allowance = await Token.allowance(
      await account.getAddress(),
      config.GENESIS.addresses.depositManager
    );
    if (allowance.gt(0)) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Approves contracts to spend ERC20 on behalf of your account
   * currently the function unlocks "infinite" amount of tokens
   */
  const approveToken = async () => {
    let Token = new CustomToken__factory(account).attach(
      config.GENESIS.addresses.exampleToken
    );

    const tx = await Token.approve(
      config.GENESIS.addresses.depositManager,
      ethers.constants.MaxUint256
    );
    Swal.fire("Tx Submitted", tx.hash, "success");

    await tx.wait(1);
    toast.success(`Approve Token Tx confirmed`);
    setShouldUpdate(true);
  };

  /**
   * get current balance of the ERC20 tokens available for the L1 account
   */
  const checkBalance = async () => {
    let Token = new CustomToken__factory(account).attach(
      config.GENESIS.addresses.exampleToken
    );

    let bal = await Token.balanceOf(await account.getAddress());
    return bal;
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

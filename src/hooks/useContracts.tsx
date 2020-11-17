import { ethers } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import * as mcl from "react-hubble-bls/dist/mcl";

import BLSAccountRegistryContract from "../contracts/BLSAccountRegistryContract.json";
// import DepositManagerContract from "../contracts/DepositManagerContract.json";
// import TestTokenContract from "../contracts/TestTokenContract.json";

declare const window: any;

const useContracts = () => {
  const initializeWeb3 = async () => {
    await window.ethereum.enable();

    const provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider
    );

    console.log(provider);
    return provider;
  };

  //   const ApproveToken = async () => {
  //     const provider = await initializeWeb3();
  //     const signer = provider.getSigner(0);

  //     let TestToken = new ethers.Contract(
  //       TestTokenContract.address,
  //       TestTokenContract.abi,
  //       signer
  //     );

  //     let tx = await TestToken.approve(DepositManagerContract.address, 100);
  //     await tx.wait();

  //     console.log("approve done");
  //   };

  //   const performDeposit = async (add: number) => {
  //     const provider = await initializeWeb3();
  //     const signer = provider.getSigner(0);

  //     let DepositManager = new ethers.Contract(
  //       DepositManagerContract.address,
  //       DepositManagerContract.abi,
  //       signer
  //     );

  //     let tx = await DepositManager.depositFor(add, 200, 1);
  //     await tx.wait();
  //     console.log("tx2", tx.hash);
  //   };

  const createNewBLSAccountRegistry = async (pubkey: mcl.PublicKey) => {
    const provider = await initializeWeb3();
    const signer = provider.getSigner(0);

    let BLSAccountRegistry = new ethers.Contract(
      BLSAccountRegistryContract.address,
      BLSAccountRegistryContract.abi,
      signer
    );

    let tx = await BLSAccountRegistry.register(pubkey);
    await tx.wait();

    provider.once(tx.hash, async (receipt) => {
      let decoder = new AbiCoder();
      let decoded = decoder.decode(
        ["uint256[4]", "uint256"],
        receipt.logs[0].data
      );
      console.log(parseInt(decoded[1]), receipt);
      //   await ApproveToken();
      //   await performDeposit(parseInt(decoded[1]));
    });
  };
  return { createNewBLSAccountRegistry };
};

export default useContracts;

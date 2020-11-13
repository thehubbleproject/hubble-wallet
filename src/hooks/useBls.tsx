import * as mcl from "react-hubble-bls/dist/mcl";
import {
  formatBytes32String,
  keccak256,
  toUtf8Bytes,
  AbiCoder,
} from "ethers/lib/utils";
import { useStoreState } from "../store/globalStore";
import { ethers } from "ethers";
import BLSAccountRegistryContract from "../contracts/BLSAccountRegistryContract.json";
import DepositManagerContract from "../contracts/DepositManagerContract.json";

declare const window: any;

const useBls = () => {
  /**
   * gets the reduced secret key from the current selected account
   */
  const reducedSecretKey = useStoreState(
    (state) => state.currentAccount.reducedSecretKey
  );

  /**
   * gets the current initialized instance of mcl-wasm
   */
  const mclwasm = mcl.getMclInstance();

  /**
   * hashes 4 public keys into a single hash so that
   * it is easier to verify addresses while sending and
   * receiving tokens from the wallet
   *
   * @param keysArray array of public keys
   */
  const combinePublicKeys = (keysArray: mcl.PublicKey | string[]): string => {
    return keccak256(toUtf8Bytes(keysArray.join()));
  };

  /**
   * reduces the complete secret key into a single string
   * which can be restored and rebuilt. This is done to
   * easily store the secret key
   *
   * @param secretKey entire exports.Fr object
   */
  const reduceSecretKey = (secretKey: mcl.SecretKey): string => {
    return secretKey.getStr();
  };

  /**
   * takes in the reduced secret key and rebuilds the exports.Fr object
   * of the mcl-wasm library
   *
   * @param reducedSecretKey reduced secret key string
   */
  const rebuildSecretKey = (reducedSecretKey: string): mcl.SecretKey => {
    const secretKey = new mclwasm.Fr();
    secretKey.setStr(reducedSecretKey);
    return secretKey;
  };

  /**
   * returns a signed object using secret key
   *
   * @param message any message string
   */
  const signMessageString = (
    message: string
  ): {
    signature: mcl.Signature;
    M: mcl.Message;
  } => {
    const secretKey = rebuildSecretKey(reducedSecretKey);
    return mcl.sign(formatBytes32String(message), secretKey);
  };

  const testF = async (pubkey: mcl.PublicKey) => {
    const provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider
    );

    const signer = provider.getSigner(0);

    let BLSAccountRegistry = new ethers.Contract(
      BLSAccountRegistryContract.address,
      BLSAccountRegistryContract.abi,
      signer
    );

    // let DepositManager = new ethers.Contract(
    //   DepositManagerContract.address,
    //   DepositManagerContract.abi,
    //   signer
    // );

    let tx1 = await BLSAccountRegistry.register(pubkey);
    await tx1.wait();

    // const makePayment = async (add: any) => {
    //   let tx2 = await DepositManager.depositFor(add, 100, 1);
    //   await tx2.wait();

    //   console.log("tx2", tx2.hash);
    // };

    provider.once(tx1.hash, (receipt) => {
      let decoder = new AbiCoder();
      let decoded = decoder.decode(
        ["uint256[4]", "uint256"],
        receipt.logs[0].data
      );
      console.log(decoded, receipt);
      //   console.log(decoded);

      //   makePayment(16);
    });
  };

  /**
   * creates a new key pair for the user
   */
  const getNewKeyPair = () => {
    const { pubkey, secret } = mcl.newKeyPair();
    const combinedPublicKey = combinePublicKeys(pubkey);
    const reducedSecretKey = reduceSecretKey(secret);

    testF(pubkey);

    return {
      publicKey: pubkey,
      combinedPublicKey,
      reducedSecretKey,
    };
  };

  return { getNewKeyPair, signMessageString, combinePublicKeys };
};

export default useBls;

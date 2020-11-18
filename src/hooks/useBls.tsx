import * as mcl from "react-hubble-bls/dist/mcl";
import { formatBytes32String, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { useStoreState } from "../store/globalStore";
import useContracts from "./useContracts";

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

  /**
   * creates a new key pair for the user
   */
  const getNewKeyPair = () => {
    const { pubkey, secret } = mcl.newKeyPair();
    const combinedPublicKey = combinePublicKeys(pubkey);
    const reducedSecretKey = reduceSecretKey(secret);

    return {
      publicKey: pubkey,
      combinedPublicKey,
      reducedSecretKey,
    };
  };

  return { getNewKeyPair, signMessageString, combinePublicKeys };
};

export default useBls;

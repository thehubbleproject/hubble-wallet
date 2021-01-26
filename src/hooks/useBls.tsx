import * as mcl from "react-hubble-bls/dist/mcl";
import { formatBytes32String, keccak256, toUtf8Bytes } from "ethers/lib/utils";
import { useStoreState } from "../store/globalStore";

const useBls = () => {
  /**
   * gets the reduced secret key from the current selected account
   */
  const reducedSecretKey = useStoreState(
    (state) => state.currentAccount.reducedSecretKey
  );

  const solG2ToBytes = (keysArray: mcl.PublicKey | string[]): string => {
    let first = keysArray[1];
    let second = keysArray[0];
    let third = keysArray[3];
    let fourth = keysArray[2];

    let finalString =
      first.split("x")[1] +
      second.split("x")[1] +
      third.split("x")[1] +
      fourth.split("x")[1];

    return finalString;
  };

  /**
   * hashes 4 public keys into a single hash so that
   * it is easier to verify addresses while sending and
   * receiving tokens from the wallet
   *
   * @param keysArray array of public keys
   */
  const combinePublicKeys = (keysArray: mcl.PublicKey | string[]): string => {
    return keccak256(toUtf8Bytes(solG2ToBytes(keysArray)));
  };

  const hashPublicKeysBytes = (keyString: string): string => {
    return keccak256(toUtf8Bytes(keyString));
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
    /**
     * gets the current initialized instance of mcl-wasm
     */
    const mclwasm = mcl.getMclInstance();
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
    const hubbleAddress = combinePublicKeys(pubkey);
    const reducedSecretKey = reduceSecretKey(secret);

    return {
      publicKey: pubkey,
      hubbleAddress,
      reducedSecretKey,
    };
  };

  return {
    getNewKeyPair,
    signMessageString,
    combinePublicKeys,
    solG2ToBytes,
    hashPublicKeysBytes,
  };
};

export default useBls;

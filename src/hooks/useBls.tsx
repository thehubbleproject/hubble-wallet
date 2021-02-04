import * as mcl from "@thehubbleproject/bls/dist/mcl";
import * as signer from "@thehubbleproject/bls/dist/signer";
import {
  keccak256,
  arrayify,
  formatBytes32String,
  toUtf8Bytes,
} from "ethers/lib/utils";
import { useStoreState } from "../store/globalStore";
import useContracts from "./useContracts";

const useBls = () => {
  /**
   * gets the reduced secret key from the current selected account
   */
  const reducedSecretKey = useStoreState(
    (state) => state.currentAccount.reducedSecretKey
  );

  const { getAppId } = useContracts();

  /**
   * converts array of public key into single bytes string
   */
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
   * hashes combined public keys into a single hash so that
   * it is easier to verify addresses while sending and
   * receiving tokens from the wallet
   *
   * @param keyString bytes from pubkey array
   */
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
  const signMessageString = async (message: string): Promise<string> => {
    const secretKey = rebuildSecretKey(reducedSecretKey);
    const appId = await getAppId();

    // 0x4ea7799478a7af2a47ba555f04aec4ae4ba240bf410d7c859c34c310f0413892
    console.log(message);
    let messageA = btoa(message);
    console.log(messageA);

    const factory = await signer.BlsSignerFactory.new();
    const signerF = factory.getSigner(arrayify(appId), secretKey);

    // const signedArray = mcl.sign(messageA, secretKey, );
    const signature = signerF.sign(message);
    console.log(signature);

    // let signatureArr = mcl.g1ToHex(signedArray.signature);
    let signatureArr = ["0x1", "0x2"];
    return signatureArr[0].split("x")[1] + signatureArr[1].split("x")[1];
  };

  /**
   * creates a new key pair for the user
   */
  const getNewKeyPair = () => {
    const { pubkey: pubkeyB, secret } = mcl.newKeyPair();

    const pubkey = mcl.g2ToHex(pubkeyB);

    const hubbleAddress = hashPublicKeysBytes(solG2ToBytes(pubkey));
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
    solG2ToBytes,
    hashPublicKeysBytes,
  };
};

export default useBls;

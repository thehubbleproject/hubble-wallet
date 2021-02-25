import * as mcl from "@thehubbleproject/bls/dist/mcl";
import * as signer from "@thehubbleproject/bls/dist/signer";
import {
  keccak256,
  arrayify,
  hexlify,
  randomBytes,
  toUtf8Bytes,
} from "ethers/lib/utils";
import { useStoreState } from "../store/globalStore";

/**
 * provides utilities to use the BLS encryption algorithm
 */
const useBls = () => {
  /**
   * app Id is the same app ID as used by the commander
   * use this same appID to stay in sync and have correct
   * signatures when generating transactions
   */
  const appId =
    "0x4ea7799478a7af2a47ba555f04aec4ae4ba240bf410d7c859c34c310f0413892";

  /**
   * gets the reduced secret key from the current selected account
   */
  const reducedSecretKey = useStoreState(
    (state) => state.currentAccount.reducedSecretKey
  );

  /**
   * converts array of public key into single bytes string
   */
  const solG2ToBytes = (keysArray: mcl.PublicKey | string[]): string => {
    let first = keysArray[0];
    let second = keysArray[1];
    let third = keysArray[2];
    let fourth = keysArray[3];

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
   * returns a signed object using secret key
   *
   * @param message any message string
   */
  const signMessageString = async (message: string): Promise<string> => {
    const secret = reducedSecretKey;
    const factory = await signer.BlsSignerFactory.new();
    const user = factory.getSigner(arrayify(appId), secret);
    const signature = user.sign("0x" + message);
    return mcl.dumpG1(signature);
  };

  /**
   * creates a new key pair for the user
   */
  const getNewKeyPair = async () => {
    const secret = hexlify(randomBytes(32));
    const factory = await signer.BlsSignerFactory.new();
    const user = factory.getSigner(arrayify(appId), secret);
    const pubkey = user.pubkey;
    const hubbleAddress = hashPublicKeysBytes(solG2ToBytes(pubkey));

    return {
      publicKey: pubkey,
      hubbleAddress,
      reducedSecretKey: secret,
    };
  };

  /**
   * creates a new key pair for the user
   */
  const getNewKeyPairFromSecret = async (secret: string) => {
    const factory = await signer.BlsSignerFactory.new();
    const user = factory.getSigner(arrayify(appId), secret);
    const pubkey = user.pubkey;
    const hubbleAddress = hashPublicKeysBytes(solG2ToBytes(pubkey));

    return {
      publicKey: pubkey,
      hubbleAddress,
      reducedSecretKey: secret,
    };
  };

  return {
    getNewKeyPair,
    getNewKeyPairFromSecret,
    signMessageString,
    solG2ToBytes,
    hashPublicKeysBytes,
  };
};

export default useBls;

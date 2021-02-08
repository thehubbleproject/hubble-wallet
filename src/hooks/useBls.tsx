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
  //   const reduceSecretKey = (secretKey: mcl.SecretKey): string => {
  //     return secretKey.getStr();
  //   };

  /**
   * takes in the reduced secret key and rebuilds the exports.Fr object
   * of the mcl-wasm library
   *
   * @param reducedSecretKey reduced secret key string
   */
  //   const rebuildSecretKey = (reducedSecretKey: string): mcl.SecretKey => {
  //     /**
  //      * gets the current initialized instance of mcl-wasm
  //      */
  //     const mclwasm = mcl.getMclInstance();
  //     const secretKey = new mclwasm.Fr();
  //     secretKey.setStr(reducedSecretKey);
  //     return secretKey;
  //   };

  /**
   * returns a signed object using secret key
   *
   * @param message any message string
   */
  const signMessageString = async (message: string): Promise<string> => {
    const secret = reducedSecretKey;
    console.log("secret key revived", secret);
    // var DefaultDomain = [32]byte{0x00, 0x00, 0x00, 0x00}
    // const appId = await getAppId();
    const factory = await signer.BlsSignerFactory.new();
    const user = factory.getSigner(arrayify("0x00000000"), secret);
    console.log("pubkey", user.pubkey);
    console.log("message", message);
    const signature = user.sign("0x" + message);
    let dump = mcl.dumpG1(signature);
    console.log("dumped", dump);
    console.log("loaded", mcl.loadG1(dump));
    return mcl.dumpG1(signature);
  };

  /**
   * creates a new key pair for the user
   */
  const getNewKeyPair = async () => {
    // const { pubkey: pubkeyB, secret } = mcl.newKeyPair();
    const secret = hexlify(randomBytes(12));
    console.log("Secret key created", secret);
    const appId = await getAppId();
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
    console.log(secret);
    const appId = await getAppId();
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

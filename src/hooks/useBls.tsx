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
import genesis from "../genesis.json";
import { ethers } from "ethers";

/**
 * provides utilities to use the BLS encryption algorithm
 */
const useBls = () => {
  /**
   * app Id is the same app ID as used by the commander
   * use this same appID to stay in sync and have correct
   * signatures when generating transactions
   */
  const appId = genesis.auxiliary.domain;

  /**
   * gets the reduced secret key from the current selected account
   */
  const reducedSecretKey = useStoreState(
    (state) => state.currentAccount.reducedSecretKey
  );

  /**
   * hashes combined public keys into a single hash so that
   * it is easier to verify addresses while sending and
   * receiving tokens from the wallet
   *
   * @param keyString bytes from pubkey array
   */
  const hashPublicKeys = (pubkey: mcl.solG2): string => {
    return ethers.utils.solidityKeccak256(
      ["uint256", "uint256", "uint256", "uint256"],
      pubkey
    );
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
    const hubbleAddress = hashPublicKeys(pubkey);

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
    const hubbleAddress = hashPublicKeys(pubkey);

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
    hashPublicKeys,
  };
};

export default useBls;

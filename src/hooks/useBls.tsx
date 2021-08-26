import * as mcl from "@thehubbleproject/bls/dist/mcl";
import { arrayify, hexlify, randomBytes } from "ethers/lib/utils";
import { useStoreState } from "../store/globalStore";
import { ethers } from "ethers";
import { SignatureInterface } from "../utils/interfaces";
import config from "../config";

class BlsSigner {
  static new(domain?: mcl.Domain, privKey?: string) {
    const secret = privKey ? mcl.parseFr(privKey) : mcl.randFr();
    return new this(secret, domain);
  }
  private _pubkey: mcl.PublicKey;
  constructor(private secret: mcl.SecretKey, private domain?: mcl.Domain) {
    this._pubkey = mcl.getPubkey(secret);
  }
  get pubkey(): mcl.solG2 {
    return mcl.g2ToHex(this._pubkey);
  }

  setDomain(domain: mcl.Domain) {
    this.domain = domain;
  }

  public sign(message: string): SignatureInterface {
    if (!this.domain) throw new Error("No domain is set");
    const { signature } = mcl.sign(message, this.secret, this.domain);
    const sol = mcl.g1ToHex(signature);
    return { mcl: signature, sol };
  }
}

/**
 * provides utilities to use the BLS encryption algorithm
 */
const useBls = () => {
  /**
   * app Id is the same app ID as used by the commander
   * use this same appID to stay in sync and have correct
   * signatures when generating transactions
   */
  const appId = config.GENESIS.auxiliary.domain;

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
  const signMessageString = (message: string): SignatureInterface => {
    const secret = reducedSecretKey;
    const signer = BlsSigner.new(arrayify(appId), secret);
    return signer.sign(message);
  };

  /**
   * creates a new key pair for the user
   */
  const getNewKeyPair = async () => {
    const secret = hexlify(randomBytes(32));
    const user = BlsSigner.new(arrayify(appId), secret);
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
    const user = BlsSigner.new(arrayify(appId), secret);
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

import { useEffect, useState } from "react";
import * as mcl from "react-hubble-bls/dist/mcl";
import { BytesLike } from "ethers";
import { hexlify } from "ethers/lib/utils";

const useBls = () => {
  const [mclwasm, setMclWasm] = useState<any>(null);

  useEffect(() => {
    const initializeMcl = async () => {
      await mcl.init();
    };

    initializeMcl();
    setMclWasm(mcl.getMclInstance());
  }, []);

  const getSecret = (key: string): mcl.SecretKey => {
    const hexKey = hexlify(key);
    if (hexKey.length !== 66) {
      throw new Error(
        "BLS private key should be 32 bytes. Did you include 0x at the start?"
      );
    }
    const fr = mclwasm.deserializeHexStrToFr(key.slice(2));
    console.log(fr.serializeToHexStr());
    return fr;
  };

  const getKeyPair = (key: BytesLike): mcl.keyPair => {
    const secret: mcl.SecretKey = getSecret(key.toString());
    const mclPubkey: mcl.PublicKey = mclwasm.mul(mcl.g2(), secret);
    const normalized = mclwasm.normalize(mclPubkey);
    const pubkey = mcl.g2ToHex(normalized);
    return { pubkey, secret };
  };

  return { getKeyPair };
};

export default useBls;

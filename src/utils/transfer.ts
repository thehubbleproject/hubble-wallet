import { dumpG1 } from "@thehubbleproject/bls/dist/mcl";
import { BigNumber } from "ethers";
import { concat, hexlify, hexZeroPad, solidityPack } from "ethers/lib/utils";
import { float16 } from "./decimal";
import { CompressedTx, OffchainTx, SignatureInterface } from "./interfaces";

const StateIDLen = 4;
const FloatLength = 2;

class TransferCompressedTx implements CompressedTx {
  public readonly txType = "0x01";
  static readonly byteLengths = [
    StateIDLen,
    StateIDLen,
    FloatLength,
    FloatLength,
  ];
  constructor(
    public readonly fromIndex: BigNumber,
    public readonly toIndex: BigNumber,
    public readonly amount: BigNumber,
    public readonly fee: BigNumber
  ) {}

  public message(nonce: BigNumber): string {
    return solidityPack(
      ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256"],
      [this.txType, this.fromIndex, this.toIndex, nonce, this.amount, this.fee]
    );
  }

  serialize() {
    return "";
  }
}

export class TransferOffchainTx
  extends TransferCompressedTx
  implements OffchainTx
{
  constructor(
    public readonly fromIndex: BigNumber,
    public readonly toIndex: BigNumber,
    public readonly amount: BigNumber,
    public readonly fee: BigNumber,
    public nonce: BigNumber,
    public signature?: SignatureInterface
  ) {
    super(fromIndex, toIndex, amount, fee);
  }

  public toCompressed(): TransferCompressedTx {
    return new TransferCompressedTx(
      this.fromIndex,
      this.toIndex,
      this.amount,
      this.fee
    );
  }

  public message(): string {
    return this.toCompressed().message(this.nonce);
  }

  serialize(): string {
    if (!this.signature) throw new Error("Signature must be assigned");
    const concated = concat([
      hexZeroPad(hexlify(this.fromIndex), StateIDLen),
      hexZeroPad(hexlify(this.toIndex), StateIDLen),
      float16.compress(this.amount),
      float16.compress(this.fee),
      hexZeroPad(hexlify(this.nonce), StateIDLen),
      dumpG1(this.signature?.sol),
    ]);
    return hexlify(concated);
  }

  hash() {
    return "";
  }

  public toString(): string {
    return `<Transfer ${this.fromIndex}->${this.toIndex} $${this.amount}  fee ${this.fee}  nonce ${this.nonce}>`;
  }
}

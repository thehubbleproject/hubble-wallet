import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { hexZeroPad } from "ethers/lib/utils";

export class Float {
  private mantissaMax: BigNumber;
  private exponentMax: number;
  private exponentMask: BigNumber;
  public bytesLength: number;
  constructor(
    public readonly exponentBits: number,
    public readonly mantissaBits: number
  ) {
    this.mantissaMax = BigNumber.from(2 ** mantissaBits - 1);
    this.exponentMax = 2 ** exponentBits - 1;
    this.exponentMask = BigNumber.from(this.exponentMax << mantissaBits);
    this.bytesLength = (mantissaBits + exponentBits) / 8;
  }

  public compress(input: BigNumberish): string {
    let mantissa = BigNumber.from(input.toString());
    let exponent = 0;
    for (; exponent < this.exponentMax; exponent++) {
      if (mantissa.isZero() || !mantissa.mod(10).isZero()) break;
      mantissa = mantissa.div(10);
    }
    if (mantissa.gt(this.mantissaMax))
      throw new Error(
        `Cannot compress ${input}, expect mantissa ${mantissa} <= ${this.mantissaMax}`
      );

    const hex = BigNumber.from(exponent)
      .shl(this.mantissaBits)
      .add(mantissa)
      .toHexString();
    return hexZeroPad(hex, this.bytesLength);
  }
  public decompress(input: BytesLike): BigNumber {
    const mantissa = this.mantissaMax.and(input);
    const exponent = this.exponentMask.and(input).shr(this.mantissaBits);

    return mantissa.mul(BigNumber.from(10).pow(exponent));
  }
}

export const float16 = new Float(4, 12);

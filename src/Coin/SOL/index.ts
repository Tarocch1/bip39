import bs58 from 'bs58'
import { HDKey } from 'micro-ed25519-hdkey'
import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit'

import { Coin } from '../Base'

export class Solana extends Coin {
  constructor(seed: Buffer) {
    super(seed)
  }

  async generate(): Promise<void> {
    console.table([await this.generateAddress()], ['address', 'privateKey'])
  }

  private async generateAddress() {
    const hd = HDKey.fromMasterSeed(this.seed)
    const child = hd.derive("m/44'/501'/0'/0'")
    const signer = await createKeyPairSignerFromPrivateKeyBytes(
      new Uint8Array(child.privateKey),
    )
    return {
      address: signer.address,
      privateKey: bs58.encode(
        new Uint8Array([...child.privateKey, ...child.publicKeyRaw]),
      ),
    }
  }
}

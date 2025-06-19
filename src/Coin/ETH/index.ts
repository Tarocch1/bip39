import { hdkey } from '@ethereumjs/wallet'

import { Coin } from '../Base'

export class ETH extends Coin {
  constructor(seed: Buffer) {
    super(seed)
  }

  async generate(): Promise<void> {
    console.table([this.generateAddress()], ['address', 'privateKey'])
  }

  private generateAddress() {
    const wallet = hdkey.EthereumHDKey.fromMasterSeed(this.seed)
      .derivePath("m/44'/60'/0'/0/0")
      .getWallet()
    return {
      address: wallet.getAddressString(),
      privateKey: wallet.getPrivateKeyString(),
    }
  }
}

import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'
import BIP32Factory from 'bip32'

import { Coin } from '../Base'

bitcoin.initEccLib(ecc)
const bip32 = BIP32Factory(ecc)

export class Bitcoin extends Coin {
  constructor(seed: Buffer) {
    super(seed)
  }

  private network = bitcoin.networks.bitcoin
  private root = bip32.fromSeed(this.seed, this.network)

  async generate(): Promise<void> {
    const result: { type: string; address: string; privateKey: string }[] = []

    result.push(this.generateLegacyAddress())
    result.push(this.generateNestedSegwitAddress())
    result.push(this.generateNativeSegwitAddress())
    result.push(this.generateTaprootAddress())

    console.table(result, ['type', 'address', 'privateKey'])
  }

  private generateLegacyAddress() {
    const child = this.root.derivePath("m/44'/0'/0'/0/0")
    const { address } = bitcoin.payments.p2pkh({
      pubkey: Buffer.from(child.publicKey),
      network: this.network,
    })
    return { type: 'Legacy', address: address!, privateKey: child.toWIF() }
  }

  private generateNestedSegwitAddress() {
    const child = this.root.derivePath("m/49'/0'/0'/0/0")
    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(child.publicKey),
        network: this.network,
      }),
      network: this.network,
    })
    return {
      type: 'Nested Segwit',
      address: address!,
      privateKey: child.toWIF(),
    }
  }

  private generateNativeSegwitAddress() {
    const child = this.root.derivePath("m/84'/0'/0'/0/0")
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(child.publicKey),
      network: this.network,
    })
    return {
      type: 'Native Segwit',
      address: address!,
      privateKey: child.toWIF(),
    }
  }

  private generateTaprootAddress() {
    const child = this.root.derivePath("m/86'/0'/0'/0/0")
    const pubkey = child.publicKey.slice(1, 33)
    const { address } = bitcoin.payments.p2tr({
      internalPubkey: Buffer.from(pubkey),
      network: this.network,
    })
    return { type: 'Taproot', address: address!, privateKey: child.toWIF() }
  }
}

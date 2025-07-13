<template>
  <UTable
    :data="data"
    :columns="columns"
    :ui="{ root: 'border border-accented rounded-md' }"
  />
</template>

<script lang="tsx" setup>
import { inject, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from '@bitcoinerlab/secp256k1'
import BIP32Factory, { type BIP32Interface } from 'bip32'

import { ctxKey } from '../../../type'

bitcoin.initEccLib(ecc)
const network = bitcoin.networks.bitcoin
const bip32 = BIP32Factory(ecc)
const ctx = inject(ctxKey)!

type DataItem = { type: string; address: string; privateKey: string }

const columns: TableColumn<DataItem>[] = [
  { header: 'Type', accessorKey: 'type' },
  {
    header: 'Address',
    accessorKey: 'address',
    cell: ({ getValue }) => (
      <a
        href={`https://blockstream.info/address/${getValue()}`}
        target="_blank"
        ref="noopener noreferrer"
      >
        {getValue()}
      </a>
    ),
  },
  { header: 'Private Key', accessorKey: 'privateKey' },
]

const data = computed<DataItem[]>(() => {
  if (!ctx.seed.value) return []
  const root = bip32.fromSeed(ctx.seed.value, network)

  return [
    generateLegacyAddress(root),
    generateNestedSegwitAddress(root),
    generateNativeSegwitAddress(root),
    generateTaprootAddress(root),
  ]
})

// 计算生成 Legacy 地址
const generateLegacyAddress = (root: BIP32Interface): DataItem => {
  const child = root.derivePath("m/44'/0'/0'/0/0")
  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(child.publicKey),
    network: network,
  })
  return { type: 'Legacy', address: address!, privateKey: child.toWIF() }
}

// 计算生成 Nested Segwit 地址
const generateNestedSegwitAddress = (root: BIP32Interface): DataItem => {
  const child = root.derivePath("m/49'/0'/0'/0/0")
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(child.publicKey),
      network: network,
    }),
    network: network,
  })
  return { type: 'Nested Segwit', address: address!, privateKey: child.toWIF() }
}

// 计算生成 Native Segwit 地址
const generateNativeSegwitAddress = (root: BIP32Interface): DataItem => {
  const child = root.derivePath("m/84'/0'/0'/0/0")
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: Buffer.from(child.publicKey),
    network: network,
  })
  return { type: 'Native Segwit', address: address!, privateKey: child.toWIF() }
}

// 计算生成 Taproot 地址
const generateTaprootAddress = (root: BIP32Interface): DataItem => {
  const child = root.derivePath("m/86'/0'/0'/0/0")
  const pubkey = child.publicKey.slice(1, 33)
  const { address } = bitcoin.payments.p2tr({
    internalPubkey: Buffer.from(pubkey),
    network: network,
  })
  return { type: 'Taproot', address: address!, privateKey: child.toWIF() }
}
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    :ui="{ root: 'border border-accented rounded-md' }"
  />
</template>

<script lang="tsx" setup>
import { inject } from 'vue'
import { computedAsync } from '@vueuse/core'
import type { TableColumn } from '@nuxt/ui'
import bs58 from 'bs58'
import { HDKey } from 'micro-key-producer/slip10.js'
import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit'

import { ctxKey } from '../../../type'

const ctx = inject(ctxKey)!

type DataItem = { address: string; privateKey: string }

const columns: TableColumn<DataItem>[] = [
  {
    header: 'Address',
    accessorKey: 'address',
    cell: ({ getValue }) => (
      <a
        href={`https://solscan.io/account/${getValue()}`}
        target="_blank"
        ref="noopener noreferrer"
      >
        {getValue()}
      </a>
    ),
  },
  { header: 'Private Key', accessorKey: 'privateKey' },
]

const data = computedAsync<DataItem[]>(async () => {
  if (!ctx.seed.value) return []

  return [await generateAddress(ctx.seed.value)]
}, [])

const generateAddress = async (seed: Buffer): Promise<DataItem> => {
  const hd = HDKey.fromMasterSeed(seed)
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
</script>

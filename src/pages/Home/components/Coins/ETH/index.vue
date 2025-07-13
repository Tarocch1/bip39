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
import { hdkey } from '@ethereumjs/wallet'

import { ctxKey } from '../../../type'

const ctx = inject(ctxKey)!

type DataItem = { address: string; privateKey: string }

const columns: TableColumn<DataItem>[] = [
  {
    header: 'Address',
    accessorKey: 'address',
    cell: ({ getValue }) => (
      <a
        href={`https://etherscan.io/address/${getValue()}`}
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

  return [generateAddress(ctx.seed.value)]
})

const generateAddress = (seed: Buffer): DataItem => {
  const wallet = hdkey.EthereumHDKey.fromMasterSeed(seed)
    .derivePath("m/44'/60'/0'/0/0")
    .getWallet()
  return {
    address: wallet.getAddressString(),
    privateKey: wallet.getPrivateKeyString(),
  }
}
</script>

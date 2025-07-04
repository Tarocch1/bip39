<template>
  <UTable
    :data="data"
    :columns="columns"
    :ui="{ root: 'border border-accented rounded-md' }"
  />
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { hdkey } from '@ethereumjs/wallet'

import { ctxKey } from '../../../type'

const ctx = inject(ctxKey)!

type DataItem = { address: string; privateKey: string }

const columns: TableColumn<DataItem>[] = [
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'privateKey', header: 'Private Key' },
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

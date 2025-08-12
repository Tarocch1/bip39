<template>
  <UForm ref="form" class="form" :schema="schema" :state="state">
    <UFormField label="Mnemonic" name="mnemonic">
      <UTextarea
        v-model="state.mnemonic"
        :ui="{ root: 'w-full' }"
        :rows="2"
        autoresize
      />

      <template #hint>
        <UButtonGroup size="sm">
          <USelect
            v-model="generateLength"
            :items="generateLengthOptions"
            :ui="{ base: 'w-[64px]' }"
            size="sm"
          />
          <UButton variant="subtle" size="sm" @click="generateMnemonic">
            Generate
          </UButton>
        </UButtonGroup>
      </template>
    </UFormField>

    <UFormField label="Passphrase" name="passphrase">
      <UInput v-model="state.passphrase" :ui="{ root: 'w-full' }" />
    </UFormField>

    <UFormField label="BIP39 Seed">
      <UTextarea
        :model-value="seedStr"
        :ui="{ root: 'w-full' }"
        :rows="1"
        autoresize
        disabled
      />
    </UFormField>
  </UForm>
</template>

<script lang="ts" setup>
import * as bip39 from 'bip39'
import { computed, inject, reactive, ref, useTemplateRef, watch } from 'vue'
import * as z from 'zod'

import { ctxKey } from '../../type'

bip39.setDefaultWordlist('english')

const ctx = inject(ctxKey)!
const form = useTemplateRef('form')

const schema = z.object({
  mnemonic: z.string().superRefine((value, ctx) => {
    const { valid, message } = validateMnemonic(value)
    if (!valid) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message })
    }
  }),
  passphrase: z.string().optional(),
})
const state = reactive<Partial<z.output<typeof schema>>>({})

// 自动生成
const generateLengthOptions = [12, 15, 18, 21, 24]
const generateLength = ref(24)
function generateMnemonic() {
  state.mnemonic = bip39.generateMnemonic(
    Math.floor(generateLength.value * 10.667),
  )
  form.value?.validate({ silent: true })
}

// 校验 mnemonic 的合法性
function validateMnemonic(mnemonic?: string) {
  if (!mnemonic || typeof mnemonic !== 'string') {
    return { valid: false, message: 'Mnemonic is required', mnemonic: '' }
  }

  let realMnemonic = ''
  const words = mnemonic.trim().split(' ').filter(Boolean)

  // 检查单词数量是否在允许的范围内
  if (!generateLengthOptions.includes(words.length)) {
    return {
      valid: false,
      message: 'Invalid mnemonic length',
      mnemonic: realMnemonic,
    }
  }

  // 检查每个单词是否在 BIP39 的英文单词列表中
  for (const word of words) {
    const realWords = bip39.wordlists.english.filter(item =>
      item.startsWith(word),
    )
    if (realWords.length === 1) {
      realMnemonic += `${realWords[0]} `
    }
    else if (realWords.length > 1 && realWords.includes(word)) {
      realMnemonic += `${word} `
    }
    else {
      return {
        valid: false,
        message: `Invalid mnemonic word "${word}"`,
        mnemonic: '',
      }
    }
  }
  realMnemonic = realMnemonic.trim()

  // 最后检查生成的 mnemonic 是否有效
  if (!bip39.validateMnemonic(realMnemonic)) {
    return { valid: false, message: 'Invalid mnemonic', mnemonic: '' }
  }

  return { valid: true, message: '', mnemonic: realMnemonic }
}

// 监听 mnemonic 的变化，更新 ctx.seed
watch(
  state,
  () => {
    const { valid, mnemonic } = validateMnemonic(state.mnemonic)
    if (valid) {
      ctx.seed.value = bip39.mnemonicToSeedSync(mnemonic, state.passphrase)
    }
  },
  { immediate: true, deep: true },
)

// 计算 BIP39 Seed 的十六进制字符串
const seedStr = computed(() => {
  return ctx.seed.value?.toString('hex')
})
</script>

<style scoped>
@reference '@/styles/index.css';

.form {
  @apply space-y-2;
}
</style>

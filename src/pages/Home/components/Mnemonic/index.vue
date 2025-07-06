<template>
  <UForm ref="form" class="form" :schema="schema" :state="state">
    <div class="mnemonic-wrap">
      <InputWithLabel class="input" label="Mnemonic">
        <UFormField name="mnemonic">
          <UTextarea
            v-model="state.mnemonic"
            :rows="2"
            autoresize
            :ui="{ root: 'w-full' }"
          />
        </UFormField>
      </InputWithLabel>

      <UButtonGroup class="generate">
        <USelect
          v-model="generateLength"
          :items="generateLengthOptions"
          :ui="{ base: 'w-16' }"
        />
        <UButton variant="subtle" @click="generateMnemonic">Generate</UButton>
      </UButtonGroup>
    </div>

    <InputWithLabel label="Passphrase">
      <UFormField name="passphrase">
        <UInput v-model="state.passphrase" :ui="{ root: 'w-full' }" />
      </UFormField>
    </InputWithLabel>

    <InputWithLabel label="BIP39 Seed">
      <UTextarea :model-value="seedStr" :rows="1" autoresize disabled />
    </InputWithLabel>
  </UForm>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, watch, computed, useTemplateRef } from 'vue'
import * as bip39 from 'bip39'
import * as z from 'zod'

import InputWithLabel from './InputWithLabel.vue'
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
const generateMnemonic = () => {
  state.mnemonic = bip39.generateMnemonic(
    Math.floor(generateLength.value * 10.667),
  )
  form.value?.validate({ silent: true })
}

// 校验 mnemonic 的合法性
const validateMnemonic = (mnemonic?: string) => {
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
    const realWords = bip39.wordlists.english.filter((item) =>
      item.startsWith(word),
    )
    if (realWords.length === 1) {
      realMnemonic += `${realWords[0]} `
    } else if (realWords.length > 1 && realWords.includes(word)) {
      realMnemonic += `${word} `
    } else {
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
  @apply my-4 space-y-4;
}

.mnemonic-wrap {
  @apply flex flex-wrap gap-2;

  & > .input {
    @apply grow;
  }

  & > .generate {
    @apply shrink-0 self-start;
    @apply pl-24 sm:pl-0;
    @apply w-full sm:w-auto;
  }
}
</style>

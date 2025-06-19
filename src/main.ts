import bip39 from 'bip39'

import { coins } from './Coin'

bip39.setDefaultWordlist('english')

const mnemonicInput: string = ''
const password: string = ''

/** 生成助记词 */
function getMnemonic() {
  let result = ''

  if (mnemonicInput) {
    const words = mnemonicInput.split(' ')
    result = words
      .filter(Boolean)
      .map((word) => {
        const _words = bip39.wordlists.english.filter((item) =>
          item.startsWith(word),
        )
        if (_words.length !== 1) {
          throw new Error(`Invalid mnemonic word: ${word}`)
        }
        return _words[0]
      })
      .join(' ')

    if (!bip39.validateMnemonic(result)) {
      throw new Error('Invalid mnemonic')
    }
  } else {
    // 24 词
    result = bip39.generateMnemonic(256)
  }

  console.log('mnemonic:', result)
  return result
}

/** 生成种子 */
function getSeed(mnemonic: string) {
  const seed = bip39.mnemonicToSeedSync(mnemonic, password)
  console.log('seed:', seed.toString('hex'))
  return seed
}

async function main() {
  const mnemonic = getMnemonic()
  const seed = getSeed(mnemonic)

  for (const Coin of coins) {
    const coin = new Coin(seed)
    console.log(`\nGenerating addresses for ${coin.constructor.name}:`)
    await coin.generate()
  }
}

await main()

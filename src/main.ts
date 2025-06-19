import bip39 from 'bip39'

bip39.setDefaultWordlist('english')
const mnemonic = bip39.generateMnemonic(256)

console.log(mnemonic)

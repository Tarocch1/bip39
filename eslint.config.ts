import antfu from '@antfu/eslint-config'
import { option } from '@tarocch1/eslint-config'

export default antfu(option({
  rules: {
    'node/prefer-global/buffer': ['off'],
  },
}))

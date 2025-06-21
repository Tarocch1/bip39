import type { Component } from 'vue'

import { BTC } from './BTC'
import { ETH } from './ETH'
import { SOL } from './SOL'

export interface Coin {
  name: string
  component: Component
}

export const coins: Coin[] = [BTC, ETH, SOL]

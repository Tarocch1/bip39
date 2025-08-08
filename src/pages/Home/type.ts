import type { InjectionKey, ShallowRef } from 'vue'

export type Ctx = { seed: ShallowRef<Buffer | null> }
export const ctxKey: InjectionKey<Ctx> = Symbol('ctx')

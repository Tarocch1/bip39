import type { ShallowRef, InjectionKey } from 'vue'

export type Ctx = { seed: ShallowRef<Buffer | null> }
export const ctxKey: InjectionKey<Ctx> = Symbol('ctx')

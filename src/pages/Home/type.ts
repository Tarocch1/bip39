import type { InjectionKey, ShallowRef } from 'vue'

export interface Ctx {
  seed: ShallowRef<Buffer | null>
}
export const ctxKey: InjectionKey<Ctx> = Symbol('ctx')

import type { RouteRecordRaw } from 'vue-router'

import Home from './Home'

export const routes: RouteRecordRaw[] = [
  {
    path: import.meta.env.BASE_URL,
    component: () => import('@/layout/index.vue'),
    children: [...Home],
  },
]

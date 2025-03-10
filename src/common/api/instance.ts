import { baseQueryWithReauth } from '@byte-creators/utils'
import { createApi } from '@reduxjs/toolkit/query/react'

type AppExtra = {
  req?: {
    cookies?: Record<string, string>
  }
}

const isAppExtra = (extra: unknown): extra is AppExtra => {
  return typeof extra === 'object' && extra !== null
}

export const messengerApi = createApi({
  baseQuery: baseQueryWithReauth(),
  endpoints: () => ({}),
  reducerPath: 'messengerApi',
  tagTypes: ['Messages', 'Me'],
})

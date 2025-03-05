import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type AppExtra = {
  req?: {
    cookies?: Record<string, string>
  }
}

const isAppExtra = (extra: unknown): extra is AppExtra => {
  return typeof extra === 'object' && extra !== null
}

export const instance = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://inctagram.work/api/',
    credentials: 'include',
    prepareHeaders: (headers, { extra }) => {
      let accessToken: string | undefined

      if (typeof window === 'undefined' && isAppExtra(extra) && extra?.req) {
        accessToken = extra.req.cookies?.accessToken
      } else if (typeof document !== 'undefined') {
        accessToken = document.cookie.split('accessToken=')[1]
      }

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
      }

      return headers
    },
  }),
  endpoints: () => ({}),
  reducerPath: 'inctagramApi',
  tagTypes: ['Messages', 'Me'],
})

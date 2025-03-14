import { baseQueryWithReauth } from '@byte-creators/utils'
import { createApi } from '@reduxjs/toolkit/query/react'

export const messengerApi = createApi({
  baseQuery: baseQueryWithReauth(),
  endpoints: () => ({}),
  reducerPath: 'messengerApi',
  tagTypes: ['Messages', 'Me'],
})

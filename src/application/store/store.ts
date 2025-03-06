import { messengerApi } from '@/application/api/instance'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([messengerApi.middleware]),
  reducer: {
    [messengerApi.reducerPath]: messengerApi.reducer,
  },
})

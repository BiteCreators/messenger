import { WS_EVENT_PATH } from '@/application/lib/consts'

import {
  type DialogsRequest,
  type DialogsResponse,
  type Error,
  MeResponse,
  type MessageData,
  MessageStatus,
  type MessagesRequest,
  type MessagesResponse,
  SearchUsersResponse,
  type SendMessageRequest,
  type UpdateMessageRequest,
} from '../types/messenger.type'
import { getSocket } from './getSocket'
import { messengerApi } from './instance'

export const messagesApi = messengerApi.injectEndpoints({
  endpoints: builder => ({
    deleteMessage: builder.mutation<void, { id: number; dialoguePartnerId: number }>({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/v1/messenger/${id}`,
      }),
      async onQueryStarted({ id, dialoguePartnerId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          dispatch(
            messagesApi.util.updateQueryData('getMessages', { dialoguePartnerId }, draft => {
              draft.items = draft.items.filter(msg => msg.id !== id)
            })
          )
        } catch (err) {
          console.error(err)
        }
      },
    }),
    getDialogs: builder.query<DialogsResponse, DialogsRequest | void>({
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, dispatch, updateCachedData }
      ) {
        await cacheDataLoaded

        const socket = getSocket()

        socket.on(WS_EVENT_PATH.RECEIVE_MESSAGE, (message: MessageData) => {
          updateCachedData(draft => {
            const index = draft.items.findIndex(
              dialog =>
                (message.ownerId === dialog.receiverId && message.receiverId === dialog.ownerId) ||
                (message.receiverId === dialog.receiverId && message.ownerId === dialog.ownerId)
            )

            if (index !== -1) {
              draft.items[index] = { ...draft.items[index], ...message }
            } else {
              dispatch(messagesApi.endpoints.getDialogs.initiate({}, { forceRefetch: true }))
            }
          })
        })

        // socket.on(WS_EVENT_PATH.MESSAGE_SENT, (message: Message) => {
        //   updateCachedData(draft => {
        //     const index = draft.items.findIndex(
        //       dialog =>
        //         (message.ownerId === dialog.receiverId && message.receiverId === dialog.ownerId) ||
        //         (message.receiverId === dialog.receiverId && message.ownerId === dialog.ownerId)
        //     )
        //
        //     if (index !== -1) {
        //       draft.items[index] = { ...draft.items[index], ...message }
        //     } else {
        //       dispatch(messagesApi.endpoints.getDialogs.initiate({}, { forceRefetch: true }))
        //     }
        //   })
        //   //????
        //   socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
        //     message: { ...message, status: MessageStatus.RECEIVED },
        //     receiverId: message.receiverId,
        //   })
        // })

        socket.on(WS_EVENT_PATH.MESSAGE_DELETED, (id: number) => {
          updateCachedData(draft => {
            const index = draft.items.findIndex(dialog => dialog.id === id)

            if (index !== -1) {
              dispatch(messagesApi.endpoints.getDialogs.initiate({}, { forceRefetch: true }))
            }
          })
        })

        socket.on(WS_EVENT_PATH.ERROR, (error: Error) => {
          console.error('WebSocket error:', error)
        })

        await cacheEntryRemoved

        socket.off(WS_EVENT_PATH.RECEIVE_MESSAGE)
        socket.off(WS_EVENT_PATH.MESSAGE_SENT)
        socket.off(WS_EVENT_PATH.MESSAGE_DELETED)
        socket.off(WS_EVENT_PATH.ERROR)
      },
      providesTags: ['Messages'],
      query: params => ({
        params: { ...params },
        url: `v1/messenger`,
      }),
    }),
    getMessages: builder.query<MessagesResponse, MessagesRequest>({
      async onCacheEntryAdded(arg, { cacheDataLoaded, cacheEntryRemoved, updateCachedData }) {
        const { dialoguePartnerId } = arg

        try {
          await cacheDataLoaded

          const socket = getSocket()

          socket.on(WS_EVENT_PATH.RECEIVE_MESSAGE, (message: MessageData) => {
            updateCachedData(draft => {
              if (
                dialoguePartnerId === message.ownerId ||
                dialoguePartnerId === message.receiverId
              ) {
                draft.items.push(message)
              }
            })
          })
          socket.on(WS_EVENT_PATH.MESSAGE_SENT, (message: MessageData) => {
            updateCachedData(draft => {
              if (
                dialoguePartnerId === message.ownerId ||
                dialoguePartnerId === message.receiverId
              ) {
                draft.items.push(message)
              }
            })
            //????
            socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
              message: { ...message, status: MessageStatus.RECEIVED },
              receiverId: message.receiverId,
            })
          })
          socket.on(WS_EVENT_PATH.MESSAGE_DELETED, (id: number) => {
            updateCachedData(draft => {
              draft.items = draft.items.filter(msg => msg.id !== id)
            })
          })
          socket.on(WS_EVENT_PATH.ERROR, (error: Error) => {
            console.error('WebSocket error in getDialogs:', error)
          })

          await cacheEntryRemoved

          socket.off(WS_EVENT_PATH.RECEIVE_MESSAGE)
          socket.off(WS_EVENT_PATH.MESSAGE_SENT)
          socket.off(WS_EVENT_PATH.MESSAGE_DELETED)
          socket.off(WS_EVENT_PATH.ERROR)
        } catch (error) {
          console.error('WebSocket error in getMessages:', error)
        }
      },
      providesTags: ['Messages'],
      query: ({ dialoguePartnerId, ...params }) => ({
        params,
        url: `v1/messenger/${dialoguePartnerId}`,
      }),
    }),
    getUsers: builder.query<
      SearchUsersResponse,
      { cursor?: number; pageNumber?: number; pageSize?: number; search?: string }
    >({
      merge: (currentData, newData) => {
        if (currentData.nextCursor === newData.nextCursor) {
          return newData
        }

        return {
          ...currentData,
          items: [...currentData.items, ...newData.items],
          nextCursor: newData.nextCursor,
        }
      },
      query: params => ({
        params,
        url: `v1/users`,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
    }),
    me: builder.query<MeResponse, void>({
      providesTags: ['Me'],
      query: body => ({
        body,
        method: 'GET',
        url: '/v1/auth/me',
      }),
    }),
    sendMessage: builder.mutation<unknown, SendMessageRequest>({
      queryFn: ({ message, receiverId }) => {
        const socket = getSocket()

        try {
          socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, { message, receiverId })

          return { data: null }
        } catch (error) {
          return { error: { error: 'Failed to send message', status: 'CUSTOM_ERROR' } }
        }
      },
    }),
    updateMessage: builder.mutation<unknown, UpdateMessageRequest>({
      queryFn: ({ id, message }) => {
        const socket = getSocket()

        try {
          socket.emit(WS_EVENT_PATH.UPDATE_MESSAGE, { id, message })

          return { data: null }
        } catch (error) {
          return { error: { error: 'Failed to send message', status: 'CUSTOM_ERROR' } }
        }
      },
    }),
    updateStatusMessage: builder.mutation<void, { ids: number[] }>({
      invalidatesTags: ['Messages'],
      query: body => ({
        body,
        method: 'PUT',
        url: `v1/messenger`,
      }),
    }),
  }),
})

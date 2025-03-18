import { WS_EVENT_PATH } from '@/application/lib/consts'

import {
  type DialogsRequest,
  type DialogsResponse,
  type Error,
  MeResponse,
  type Message,
  MessageStatus,
  MessageType,
  type MessagesRequest,
  type MessagesResponse,
  type SendMessageRequest,
  type UpdateMessageRequest,
} from '../types/messenger.type'
import { getSocket } from './getSocket'
import { messengerApi } from './instance'

export const messagesApi = messengerApi.injectEndpoints({
  endpoints: builder => ({
    deleteMessage: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        method: 'DELETE',
        url: `/v1/messanger/${id}`,
      }),
    }),
    getDialogs: builder.query<DialogsResponse, DialogsRequest | void>({
      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, dispatch, updateCachedData }
      ) {
        await cacheDataLoaded

        const socket = getSocket()

        // socket.on(WS_EVENT_PATH.RECEIVE_MESSAGE, (message: Message) => {
        //   if (message.messageType === MessageType.VOICE) {
        //     const base64Data = message.messageText.split(',')[1] // Убираем префикс "data:audio/webm;base64,"
        //     const byteCharacters = atob(base64Data) // Декодируем base64
        //     const byteNumbers = new Array(byteCharacters.length)
        //
        //     for (let i = 0; i < byteCharacters.length; i++) {
        //       byteNumbers[i] = byteCharacters.charCodeAt(i)
        //     }
        //
        //     const byteArray = new Uint8Array(byteNumbers)
        //     const audioBlob = new Blob([byteArray], { type: 'audio/webm' }) // Создаем Blob
        //     const audioUrl = URL.createObjectURL(audioBlob) // Создаем URL для воспроизведения
        //
        //     // Сохраняем URL в состоянии
        //     updateCachedData(draft => {
        //       draft.items.push({
        //         ...message,
        //         avatars: [], // Добавляем пустой массив avatars
        //         messageText: audioUrl, // Сохраняем URL вместо base64
        //         userName: 'Unknown', // Добавляем имя пользователя
        //       })
        //     })
        //   } else {
        //     // Обычное текстовое сообщение
        //     updateCachedData(draft => {
        //       draft.items.push({
        //         ...message,
        //         avatars: [], // Добавляем пустой массив avatars
        //         userName: 'Unknown', // Добавляем имя пользователя
        //       })
        //     })
        //   }
        // })

        socket.on(WS_EVENT_PATH.RECEIVE_MESSAGE, (message: Message) => {
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
        socket.on(WS_EVENT_PATH.MESSAGE_SENT, (message: Message) => {
          updateCachedData(draft => {
            draft.items.push(message)
          })
          //????
          socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
            message: { ...message, status: MessageStatus.RECEIVED },
            receiverId: message.receiverId,
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
        url: `v1/messanger`,
      }),
    }),
    getMessages: builder.query<MessagesResponse, MessagesRequest>({
      async onCacheEntryAdded(_, { cacheDataLoaded, cacheEntryRemoved, updateCachedData }) {
        try {
          await cacheDataLoaded

          const socket = getSocket()

          socket.on(WS_EVENT_PATH.RECEIVE_MESSAGE, (message: Message) => {
            if (message.messageText.startsWith('data:audio/webm;base64,')) {
              // Обработка голосового сообщения
              const base64Data = message.messageText.split(',')[1]
              const byteCharacters = atob(base64Data)
              const byteNumbers = new Array(byteCharacters.length)

              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
              }

              const byteArray = new Uint8Array(byteNumbers)
              const audioBlob = new Blob([byteArray], { type: 'audio/webm' })
              const audioUrl = URL.createObjectURL(audioBlob)

              updateCachedData(draft => {
                draft.items.push({
                  ...message,
                  messageText: audioUrl, // Сохраняем URL вместо base64
                })
              })
            } else {
              // Обычное текстовое сообщение
              updateCachedData(draft => {
                draft.items.push(message)
              })
            }
          })
          socket.on(WS_EVENT_PATH.MESSAGE_SENT, (message: Message) => {
            updateCachedData(draft => {
              draft.items.push(message)
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
        url: `v1/messanger/${dialoguePartnerId}`,
      }),
    }),
    me: builder.query<MeResponse, void>({
      providesTags: ['Me'],
      query: body => ({
        body,
        method: 'GET',
        url: '/v1/auth/me',
      }),
    }),
    // sendMessage: builder.mutation<unknown, SendMessageRequest>({
    //   queryFn: ({ message, receiverId }) => {
    //     const socket = getSocket()
    //
    //     try {
    //       socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, { message, receiverId })
    //
    //       return { data: null }
    //     } catch (error) {
    //       return { error: { error: 'Failed to send message', status: 'CUSTOM_ERROR' } }
    //     }
    //   },
    // }),
    sendMessage: builder.mutation<unknown, SendMessageRequest>({
      queryFn: ({ message, receiverId }) => {
        const socket = getSocket()

        try {
          socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
            message, // Отправляем base64 как строку
            receiverId,
          })

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
        url: `v1/messanger`,
      }),
    }),
  }),
})

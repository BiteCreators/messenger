import { useEffect, useRef } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { useRouter } from 'next/router'

export const useMessagesMarkup = () => {
  const { query } = useRouter()
  const dialoguePartnerId = Number(query.id) || 0
  const { data, isLoading, isFetching } = messagesApi.useGetMessagesQuery({
    dialoguePartnerId,
  })
  const [updateMessageStatus] = messagesApi.useUpdateStatusMessageMutation()
  const { data: me } = messagesApi.useMeQuery()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && data && me) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })

      const unreadMessages = data.items.filter(
        m => m.receiverId === me.userId && m.status !== 'READ'
      )

      if (unreadMessages.length > 0) {
        updateMessageStatus({ ids: unreadMessages.map(m => m.id) })
      }
    }
  }, [data, isLoading, updateMessageStatus, me])

  return {
    isFetching,
    isLoading,
    data,
    query,
    messagesEndRef,
  }
}

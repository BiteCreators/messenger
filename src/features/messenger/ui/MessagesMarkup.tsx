import { useEffect, useRef } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { Message } from '@/features/messenger/ui/Message'
import { ScrollArea } from '@byte-creators/ui-kit'
import { useRouter } from 'next/router'

import styles from './styles/Message.module.css'

export const MessagesMarkup = () => {
  const { query } = useRouter()
  const dialoguePartnerId = Number(query.id) || 0
  const { data, isLoading, isFetching } = messagesApi.useGetMessagesQuery({
    dialoguePartnerId,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && data) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [data, isLoading])

  if (isLoading || isFetching) {
    return null
  }

  return (
    <ScrollArea className={styles.messagesScrollArea}>
      <div className={styles.messagesContainer}>
        {data?.items
          .slice()
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map(item => {
            const isOwner = item.receiverId === Number(query.id)
            const voiceMessage = item.messageType === 'VOICE'
            const imgMessage = item.messageType === 'IMAGE'
            const imgMessageWithoutText = imgMessage && item.messageText === ''
            const isReceivedMessage = item.status === 'RECEIVED' && !isOwner
            const isReadMessage = item.status === 'READ' && !isOwner

            return (
              <Message
                key={item.id}
                imgMessage={imgMessage}
                imgMessageWithoutText={imgMessageWithoutText}
                isOwner={isOwner}
                isReadMessage={isReadMessage}
                isReceivedMessage={isReceivedMessage}
                item={item}
                voiceMessage={voiceMessage}
              />
            )
          })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}

import { useMessagesMarkup } from '@/features/messenger/model'
import { Message } from '@/features/messenger/ui/Message'
import { ScrollArea } from '@byte-creators/ui-kit'

import styles from './styles/Message.module.css'

export const MessagesMarkup = () => {
  const { isFetching, isLoading, data, query, messagesEndRef } = useMessagesMarkup()

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
            const isReceivedMessage = item.status === 'SENT' && isOwner
            const isReadMessage = item.status === 'READ' && isOwner

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

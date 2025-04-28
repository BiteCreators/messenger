import { messagesApi } from '@/common/api/messenger.api'
import { Message } from '@/features/messenger/ui/Message'
import { LoaderBlock, ScrollArea } from '@byte-creators/ui-kit'
import { useRouter } from 'next/router'
import styles from './styles/Message.module.css'

export const MessagesMarkup = () => {
  const { query } = useRouter()
  const { data, isLoading } = messagesApi.useGetMessagesQuery({
    dialoguePartnerId: Number(query.id) || 0,
  })

  if (isLoading) {
    return (
      <div className={styles.messagesScrollArea}>
        <LoaderBlock portal={true} />
      </div>
    )
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
      </div>
    </ScrollArea>
  )
}

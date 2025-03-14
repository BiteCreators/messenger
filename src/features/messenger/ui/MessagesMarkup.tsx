import { messagesApi } from '@/common/api/messenger.api'
import { Message } from '@/features/messenger/ui/Message'
import { ScrollArea } from '@byte-creators/ui-kit'
import { useRouter } from 'next/router'

export const MessagesMarkup = () => {
  const { query } = useRouter()
  const { data } = messagesApi.useGetMessagesQuery({
    dialoguePartnerId: Number(query.id) || 0,
  })

  return (
    // <ScrollArea className={mockImages.length && step === 1 ? 'h-[55vh]' : 'h-[60vh]'}>
    <div className={'px-6 h-full content-end'}>
      {data?.items.map(item => {
        const isOwner = item.ownerId !== Number(query.id)
        const voiceMessage = item.messageType === 'VOICE'
        const imgMessage = item.messageType === 'IMAGE'
        const imgMessageWithoutText = imgMessage && item.messageText === ''
        const isReceivedMessage = item.status === 'RECEIVED' && isOwner
        const isReadMessage = item.status === 'READ' && isOwner

        return (
          <Message
            imgMessage={imgMessage}
            imgMessageWithoutText={imgMessageWithoutText}
            isOwner={isOwner}
            isReadMessage={isReadMessage}
            isReceivedMessage={isReceivedMessage}
            item={item}
            key={item.id}
            voiceMessage={voiceMessage}
          />
        )
      })}
    </div>
    // </ScrollArea>
  )
}

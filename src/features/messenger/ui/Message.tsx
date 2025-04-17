import { messagesApi } from '@/common/api/messenger.api'
import { Avatar, Typography } from '@byte-creators/ui-kit'
import { CheckmarkOutline, DoneAllOutline } from '@byte-creators/ui-kit/icons'
import { cn } from '@byte-creators/utils'
import { useRouter } from 'next/router'
import styles from './styles/message.module.css'

type Props = {
  imgMessage: boolean
  imgMessageWithoutText: boolean
  isOwner: boolean
  isReadMessage: boolean
  isReceivedMessage: boolean
  item: any
  voiceMessage: boolean
}

export const Message = ({
  imgMessage,
  imgMessageWithoutText,
  isOwner,
  isReadMessage,
  isReceivedMessage,
  item,
  voiceMessage,
}: Props) => {
  const { query } = useRouter()
  const { data } = messagesApi.useGetDialogsQuery()
  const currentDialog = data?.items.filter(item => item.receiverId === Number(query.id))[0]

  return (
    <div className={cn(styles.messageContainer, isOwner && styles.justifyEnd)}>
      {!isOwner && (
        <div className={styles.avatarWrapper}>
          <Avatar avatarURL={currentDialog?.avatars?.[0]?.url || ''} isNextLink={false} />
        </div>
      )}
      <div
        className={cn(
          styles.messageContent,
          isOwner ? 'bg-primary-900' : 'bg-dark-300',
          imgMessageWithoutText && 'bg-transparent'
        )}
      >
        {imgMessage && <img alt="Image message" className={styles.image} src={item.url} />}
        {!imgMessageWithoutText ? (
          <Typography className={styles.text} variant="regular-text">
            {voiceMessage ? 'Voice message' : item.messageText}
          </Typography>
        ) : null}
        <Typography className={styles.timestamp} variant="small-text">
          <span className={styles.timestampTime}>
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              hour12: false,
              minute: '2-digit',
            })}
          </span>
          {isReceivedMessage && <CheckmarkOutline height={16} viewBox="0 0 20 25" width={16} />}
          {isReadMessage && <DoneAllOutline height={16} viewBox="0 0 20 25" width={16} />}
        </Typography>
      </div>
    </div>
  )
}

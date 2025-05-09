import { MessageData } from '@/common/types/messenger.type'
import { useMessage } from '@/features/messenger/model'
import { Alert, Avatar, Typography } from '@byte-creators/ui-kit'
import { CheckmarkOutline, DoneAllOutline } from '@byte-creators/ui-kit/icons'
import { cn } from '@byte-creators/utils'

import styles from './styles/Message.module.css'

type Props = {
  imgMessage: boolean
  imgMessageWithoutText: boolean
  isOwner: boolean
  isReadMessage: boolean
  isReceivedMessage: boolean
  item: MessageData
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
  const { alertMessage, handleDeleteMessage, companionAvatarURL, currentDialog } = useMessage(
    isOwner,
    item
  )

  return (
    <div className={cn(styles.messageContainer, isOwner && styles.justifyEnd)}>
      {!isOwner && currentDialog && (
        <div className={styles.avatarWrapper}>
          <Avatar avatarURL={companionAvatarURL} isNextLink={false} />
        </div>
      )}
      <div
        className={styles.messageContent}
        style={{
          backgroundColor: `var(${isOwner ? '--color-primary-900' : '--color-dark-300'})`,
        }}
      >
        {imgMessage && <img alt={'Image message'} className={styles.image} src={''} />}
        {!imgMessageWithoutText ? (
          <Typography className={styles.text} variant={'regular-text'}>
            {voiceMessage ? 'Voice message' : item.messageText}
          </Typography>
        ) : null}
        <Typography className={styles.timestamp} variant={'small-text'}>
          <div className={styles.messageActions}>
            {isOwner && (
              <button className={styles.timestampTime} onClick={handleDeleteMessage}>
                delete
              </button>
            )}
            <span className={!isOwner ? styles.timestampWrapper : ''}>
              {new Date(item.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                hour12: false,
                minute: '2-digit',
              })}
            </span>
            {isReceivedMessage && (
              <CheckmarkOutline
                className={styles.messageCheckmark}
                height={16}
                viewBox={'0 0 20 25'}
                width={16}
              />
            )}
            {isReadMessage && (
              <DoneAllOutline
                className={styles.messageCheckmarkDone}
                height={16}
                viewBox={'0 0 20 25'}
                width={16}
              />
            )}
          </div>
        </Typography>
      </div>
      {alertMessage && <Alert type={'error'} message={alertMessage} purpose={'toast'} />}
    </div>
  )
}

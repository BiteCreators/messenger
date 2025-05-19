import { MessageData } from '@/common/types/messenger.type'
import { useMessage } from '@/features/messenger/model'
import { ActionConfirmation, Alert, Avatar, Button, Typography } from '@byte-creators/ui-kit'
import { CheckmarkOutline, DoneAllOutline, TrashOutline } from '@byte-creators/ui-kit/icons'
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

export const Message = ({ isOwner, isReadMessage, isReceivedMessage, item }: Props) => {
  const {
    alertMessage,
    confirmOpen,
    handleReject,
    handleConfirm,
    handleDeleteMessage,
    companionAvatarURL,
    currentDialog,
    setConfirmOpen,
  } = useMessage(isOwner, item)

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
        <Typography className={styles.text} variant={'regular-text'}>
          {item.messageText}
        </Typography>
        <Typography className={styles.timestamp} variant={'small-text'}>
          <div className={styles.messageActions}>
            {isOwner && (
              <Button
                variant={'text'}
                onClick={handleDeleteMessage}
                className={styles.deleteButton}
              >
                <TrashOutline width={20} height={20} viewBox={'0 0 24 24'} />
              </Button>
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
      <ActionConfirmation
        isOpen={confirmOpen}
        message={`Are you sure you want to delete this message? It will also be deleted from ${currentDialog?.userName}`}
        onConfirm={handleConfirm}
        onReject={handleReject}
        setIsOpen={setConfirmOpen}
        title={'Delete message'}
      />
    </div>
  )
}

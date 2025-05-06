import { useEffect } from 'react'

import { Message, messagesApi, MessageStatus } from '@/application'
import { WS_EVENT_PATH } from '@/application/lib/consts'
import { getSocket } from '@/common/api/getSocket'
import { DialogsList } from '@/features/messenger/ui/DialogsList'
import { MessengerWindow } from '@/features/messenger/ui/MessengerWindow'
import { Typography } from '@byte-creators/ui-kit'

import styles from './styles/Messenger.module.css'

const Messenger = () => {
  const { data } = messagesApi.useMeQuery()

  useEffect(() => {
    if (!data) {
      return
    }
    const socket = getSocket()

    socket.on(WS_EVENT_PATH.MESSAGE_SENT, (message: Message) => {
      let id: number

      if (message.receiverId === data?.userId) {
        id = message.ownerId
      } else {
        id = message.receiverId
      }
      messagesApi.util.updateQueryData('getMessages', { dialoguePartnerId: id }, draft => {
        draft.items.push(message)
      })
      socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
        message: { ...message, status: MessageStatus.RECEIVED },
        receiverId: message.receiverId,
      })
    })

    return () => {
      socket.off(WS_EVENT_PATH.MESSAGE_SENT)
    }
  }, [data])

  return (
    <div className={styles.messengerWrapper}>
      <Typography className={styles.title} variant={'h1'}>
        Messenger
      </Typography>
      <div className={styles.contentWrapper}>
        <DialogsList />
        <MessengerWindow />
      </div>
    </div>
  )
}

export default Messenger

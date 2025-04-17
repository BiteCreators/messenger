import { DialogsList } from '@/features/messenger/ui/DialogsList'
import { MessengerWindow } from '@/features/messenger/ui/MessengerWindow'
import { Typography } from '@byte-creators/ui-kit'
import styles from './styles/Messenger.module.css'

const Messenger = () => {
  return (
    <div className={styles.messengerWrapper}>
      <Typography className={styles.title} variant="h1">
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

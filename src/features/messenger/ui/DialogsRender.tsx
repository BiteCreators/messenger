import Skeleton from 'react-loading-skeleton'

import { dateFormat } from '@/application/utils/dataFormat'
import { Dialog } from '@/common/types/messenger.type'
import { Avatar } from '@byte-creators/ui-kit'

import styles from './styles/DialogsRender.module.css'

type Props = {
  dialog: Dialog
  handleUserClick: (userData: { id: number }) => void
  isLoading: boolean
  currentUserId: number
}

export const DialogsRender = ({ dialog, handleUserClick, isLoading, currentUserId }: Props) => {
  return (
    <li
      className={styles.dialogItem}
      key={dialog.id}
      onClick={() => {
        const companionId = dialog.ownerId === currentUserId ? dialog.receiverId : dialog.ownerId

        handleUserClick({
          id: companionId,
        })
      }}
    >
      <div className={styles.avatarWrapper}>
        <Avatar avatarURL={dialog.avatars?.[0]?.url || ''} />
      </div>

      <div className={styles.contentWrapper} style={!isLoading ? { gap: '8px' } : {}}>
        {isLoading ? (
          <Skeleton height={10} width={120} />
        ) : (
          <span className={styles.userName}>{dialog.userName}</span>
        )}
        {isLoading ? (
          <Skeleton height={8} width={80} />
        ) : (
          <span className={styles.messageText}>{dialog.messageText}</span>
        )}
      </div>

      <span className={styles.dateText}>
        {isLoading ? <Skeleton height={10} width={15} /> : dateFormat(dialog.updatedAt, 'en')}
      </span>
    </li>
  )
}

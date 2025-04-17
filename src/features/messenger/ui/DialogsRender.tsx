import Skeleton from 'react-loading-skeleton'
import { dateFormat } from '@/application/utils/dataFormat'
import { Dialog } from '@/common/types/messenger.type'
import { Avatar } from '@byte-creators/ui-kit'
import { cn } from '@byte-creators/utils'
import styles from './styles/DialogsRender.module.css'

type Props = {
  dialog: Dialog
  handleUserClick: (userData: { id: number }) => void
  isLoading: boolean
}

export const DialogsRender = ({ dialog, handleUserClick, isLoading }: Props) => {
  const currentUserId = 0

  return (
    <li
      className={cn(styles.dialogItem, 'hover:bg-dark-100 border-dark-300')}
      key={dialog.id}
      onClick={() =>
        handleUserClick({
          id: dialog.receiverId === currentUserId ? dialog.ownerId : dialog.receiverId,
        })
      }
    >
      <div className={styles.avatarWrapper}>
        <Avatar avatarURL={dialog.avatars?.[0]?.url || ''} />
      </div>

      <div className={cn(styles.contentWrapper, !isLoading && 'gap-2')}>
        {isLoading ? (
          <Skeleton height={10} width={120} />
        ) : (
          <span className={cn(styles.userName, 'text-light-100')}>{dialog.userName}</span>
        )}
        {isLoading ? (
          <Skeleton height={8} width={80} />
        ) : (
          <span className={cn(styles.messageText, 'text-light-900')}>{dialog.messageText}</span>
        )}
      </div>

      <span className={cn(styles.dateText, 'text-light-900')}>
        {isLoading ? <Skeleton height={10} width={15} /> : dateFormat(dialog.updatedAt, 'en')}
      </span>
    </li>
  )
}

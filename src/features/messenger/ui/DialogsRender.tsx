import Skeleton from 'react-loading-skeleton'

import { dateFormat } from '@/application/utils/dataFormat'
import { Dialog } from '@/common/types/messenger.type'
import { Avatar } from '@byte-creators/ui-kit'
import { cn } from '@byte-creators/utils'

type Props = {
  dialog: Dialog
  handleUserClick: (userData: { id: number }) => void
  isLoading: boolean
}

export const DialogsRender = ({ dialog, handleUserClick, isLoading }: Props) => {
  const currentUserId = 0

  return (
    <li
      className={
        'flex p-3 gap-3 hover:bg-dark-100 border-t border-b border-dark-300 cursor-pointer'
      }
      key={dialog.id}
      onClick={() =>
        handleUserClick({
          id: dialog.receiverId === currentUserId ? dialog.ownerId : dialog.receiverId,
        })
      }
    >
      <div style={{ width: '45px' }}>
        <Avatar avatarURL={dialog.avatars?.[0]?.url || ''} />
      </div>

      <div className={cn('flex flex-col grow', [!isLoading && 'gap-2'])}>
        {isLoading ? (
          <Skeleton height={10} width={120} />
        ) : (
          <span
            style={{ width: '145px', fontSize: '14px' }}
            className={'text-light-100 whitespace-nowrap overflow-hidden'}
          >
            {dialog.userName}
          </span>
        )}
        {isLoading ? (
          <Skeleton height={8} width={80} />
        ) : (
          <span
            className={'text-light-900 text-xs whitespace-nowrap overflow-hidden'}
            style={{ width: '145px' }}
          >
            {dialog.messageText}
          </span>
        )}
      </div>
      <span className={'text-light-900 text-xs mt-0.5'}>
        {isLoading ? <Skeleton height={10} width={15} /> : dateFormat(dialog.updatedAt, 'en')}
      </span>
    </li>
  )
}

import Skeleton from 'react-loading-skeleton'

import { Dialog } from '@/application/types/messenger.types'
import { dateFormat } from '@/application/utils/dataFormat'
import { useDialogsList } from '@/features/messenger/model/useDialogsList'
import { Avatar, ScrollArea } from '@byte-creators/ui-kit'
import { SearchComponent } from '@byte-creators/ui-kit/components'
import { cn } from '@byte-creators/utils'

export const DialogsList = () => {
  const { data, handleUserClick, isLoading } = useDialogsList()

  return (
    <div className={'flex'}>
      <div className={'border-dark-300 border max-w-[270px] bg-dark-500'}>
        <div className={'px-3 py-5'}>
          <SearchComponent fullWidth />
        </div>
        {data ? (
          // <ScrollArea className={'h-[600px]'}>
          <ul>
            {data.items.map((dialog: Dialog) => (
              <li
                className={
                  'flex p-3 gap-3 hover:bg-dark-100 border-t border-dark-300 cursor-pointer'
                }
                key={dialog.id}
                onClick={() => handleUserClick(dialog.receiverId)}
              >
                <Avatar
                  avatarURL={dialog.avatars?.[1]?.url || ''}
                  linkContainerClassname={'w-[45px]'}
                />
                <div className={cn('flex flex-col grow', [!isLoading && 'gap-2'])}>
                  {isLoading ? (
                    <Skeleton height={10} width={120} />
                  ) : (
                    <span
                      className={
                        'text-light-100 text-[14px] w-[145px] whitespace-nowrap overflow-hidden'
                      }
                    >
                      {dialog.userName}
                    </span>
                  )}
                  {isLoading ? (
                    <Skeleton height={8} width={80} />
                  ) : (
                    <span
                      className={
                        'text-light-900 text-xs w-[145px] whitespace-nowrap overflow-hidden'
                      }
                    >
                      {dialog.messageText}
                    </span>
                  )}
                </div>
                <span className={'text-light-900 text-xs mt-0.5'}>
                  {isLoading ? (
                    <Skeleton height={10} width={15} />
                  ) : (
                    dateFormat(dialog.updatedAt, 'en')
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          // </ScrollArea>
          <p>No dialogs</p>
        )}
      </div>
    </div>
  )
}

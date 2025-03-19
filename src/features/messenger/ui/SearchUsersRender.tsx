import { ForwardedRef, forwardRef } from 'react'
import Skeleton from 'react-loading-skeleton'

import { SearchUser } from '@/common/types/messenger.type'
import { Avatar } from '@byte-creators/ui-kit'
import { cn } from '@byte-creators/utils'

type Props = {
  handleUserClick: (userData: { name: string }) => void
  isLoading: boolean
  user: SearchUser
}

export const SearchUsersRender = forwardRef(
  ({ handleUserClick, isLoading, user }: Props, ref: ForwardedRef<HTMLLIElement>) => {
    return (
      <li
        className={'flex p-3 gap-3 hover:bg-dark-100 border-t border-dark-300 cursor-pointer'}
        key={user.id}
        onClick={() => handleUserClick({ name: user.userName })}
        ref={ref}
      >
        <Avatar avatarURL={user.avatars[0]?.url || ''} linkContainerClassname={'w-[45px]'} />
        <div className={cn('flex flex-col grow', [!isLoading && 'gap-2'])}>
          {isLoading ? (
            <Skeleton height={10} width={120} />
          ) : (
            <span
              className={'text-light-100 text-[14px] w-[145px] whitespace-nowrap overflow-hidden'}
            >
              {user.userName}
            </span>
          )}
        </div>
      </li>
    )
  }
)

import { ForwardedRef, forwardRef } from 'react'
import Skeleton from 'react-loading-skeleton'

import { SearchUser } from '@/common/types/messenger.type'
import { Avatar } from '@byte-creators/ui-kit'
import { cn } from '@byte-creators/utils'
import styles from './styles/SearchUsersRender.module.css'

type Props = {
  handleUserClick: (userData: { name: string }) => void
  isLoading: boolean
  user: SearchUser
}

export const SearchUsersRender = forwardRef(
  ({ handleUserClick, isLoading, user }: Props, ref: ForwardedRef<HTMLLIElement>) => {
    return (
      <li
        className={cn(styles.listItem, 'hover:bg-dark-100 border-dark-300')}
        key={user.id}
        onClick={() => handleUserClick({ name: user.userName })}
        ref={ref}
      >
        <div className={styles.avatarWrapper}>
          <Avatar avatarURL={user.avatars[0]?.url || ''} />
        </div>
        <div className={cn(styles.contentWrapper, !isLoading && 'gap-2')}>
          {isLoading ? (
            <Skeleton height={10} width={120} />
          ) : (
            <span className={cn(styles.userName, 'text-light-100')}>{user.userName}</span>
          )}
        </div>
      </li>
    )
  }
)

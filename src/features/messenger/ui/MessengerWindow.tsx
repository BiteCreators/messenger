import { MessagesMarkup } from '@/features/messenger/ui/MessagesMarkup'
import { SendMessageTextArea } from '@/features/messenger/ui/SendMessageTextArea'
import { useMessengerWindow } from '@/features/messenger/ui/useMessengerWindow'
import { Avatar, Typography } from '@byte-creators/ui-kit'
import styles from './styles/MessengerWindow.module.css'
import { cn } from '@byte-creators/utils'

export const MessengerWindow = () => {
  const { profileData, query } = useMessengerWindow()

  return (
    <div className={cn(styles.windowWrapper, 'border-dark-300')}>
      {query.id || query.name ? (
        <div className={cn(styles.dialogWrapper, 'border-dark-300')}>
          {profileData && (
            <ul className={cn(styles.header, 'border-dark-300', 'bg-dark-500')}>
              <li>
                <div className={styles.avatarWrapper}>
                  <Avatar avatarURL={profileData.avatars?.[0]?.url || ''} />
                </div>
              </li>
              <li>{profileData.userName}</li>
            </ul>
          )}
          <MessagesMarkup />
          <SendMessageTextArea onChange={() => {}} />
        </div>
      ) : (
        <div className={styles.emptyStateWrapper}>
          <div className={cn(styles.emptyStateBox, 'bg-dark-300')}>
            <Typography variant="medium-text">Choose who you would like to talk to</Typography>
          </div>
        </div>
      )}
    </div>
  )
}

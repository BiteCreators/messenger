import { MessagesMarkup } from '@/features/messenger/ui/MessagesMarkup'
import { SendMessageTextArea } from '@/features/messenger/ui/SendMessageTextArea'
import { useMessengerWindow } from '@/features/messenger/ui/useMessengerWindow'
import { Avatar, Typography } from '@byte-creators/ui-kit'

import styles from './styles/MessengerWindow.module.css'

export const MessengerWindow = () => {
  const { profileData, query } = useMessengerWindow()

  return (
    <div className={styles.windowWrapper}>
      {query.id || query.name ? (
        <div className={styles.dialogWrapper}>
          {profileData && (
            <ul className={styles.header}>
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
          <div className={styles.emptyStateBox}>
            <Typography variant={'medium-text'}>Choose who you would like to talk to</Typography>
          </div>
        </div>
      )}
    </div>
  )
}

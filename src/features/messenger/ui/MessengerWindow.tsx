import { MessagesMarkup } from '@/features/messenger/ui/MessagesMarkup'
import { SendMessageTextArea } from '@/features/messenger/ui/SendMessageTextArea'
import { useMessengerWindow } from '@/features/messenger/ui/useMessengerWindow'
import { Avatar, Typography } from '@byte-creators/ui-kit'

export const MessengerWindow = () => {
  const { profileData, query } = useMessengerWindow()

  return (
    <div
      className={'flex flex-col border-t border-r border-b border-dark-300'}
      style={{ width: '75%', height: '650px' }}
    >
      {query.id || query.name ? (
        <div className={'w-full flex flex-col justify-between h-full border-dark-300'}>
          {profileData && (
            <ul className={'flex items-center gap-3 p-3 border-b border-dark-300 bg-dark-500'}>
              <li>
                <div style={{ width: '45px' }}>
                  <Avatar
                    avatarURL={profileData.avatars?.[0]?.url || ''}
                    // linkContainerClassname={'w-[45px]'}
                  />
                </div>
              </li>
              <li>{profileData.userName}</li>
            </ul>
          )}
          <MessagesMarkup />
          <SendMessageTextArea onChange={() => {}} />
        </div>
      ) : (
        <div className={'h-full flex justify-center items-center'}>
          <div className={'py-3 px-6 rounded-lg bg-dark-300'}>
            <Typography variant={'medium-text'}>Choose who you would like to talk to</Typography>
          </div>
        </div>
      )}
    </div>
  )
}

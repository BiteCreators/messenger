import { messagesApi } from '@/application/api/messenger.api'
import { MessagesMarkup } from '@/features/messenger/ui/MessagesMarkup'
import { SendMessageTextArea } from '@/features/messenger/ui/SendMessageTextArea'
import { Typography, UserProfile } from '@byte-creators/ui-kit'
import { useRouter } from 'next/router'

export const MessengerWindow = () => {
  const { query } = useRouter()
  const { data } = messagesApi.useGetDialogsQuery()
  const currentDialog = data?.items.filter(item => item.ownerId === Number(query.id))[0]

  return (
    <div
      className={
        'flex flex-col justify-between h-full w-[75%] border-[2px] border-dark-300 overflow-y-hidden'
      }
    >
      <div className={'w-full bg-dark-500 border-b border-dark-300 h-[72px] p-3 pt-4'}>
        {currentDialog ? (
          <UserProfile
            avatarUrl={currentDialog.avatars[0].url}
            profileId={currentDialog.ownerId}
            userName={currentDialog.userName}
          />
        ) : null}
      </div>
      {currentDialog ? (
        <>
          <MessagesMarkup />
          <SendMessageTextArea onChange={() => {}} />
        </>
      ) : (
        <div className={'h-[65vh] flex justify-center items-center'}>
          <div className={'py-3 px-6 rounded-lg bg-dark-300'}>
            <Typography variant={'medium-text'}>Choose who you would like to talk to</Typography>
          </div>
        </div>
      )}
    </div>
  )
}

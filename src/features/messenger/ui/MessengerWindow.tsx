import { messagesApi } from '@/common/api/messenger.api'
import { MessagesMarkup } from '@/features/messenger/ui/MessagesMarkup'
import { SendMessageTextArea } from '@/features/messenger/ui/SendMessageTextArea'
import { Typography, UserProfile } from '@byte-creators/ui-kit'
import { useRouter } from 'next/router'

export const MessengerWindow = () => {
  const { query } = useRouter()
  const { data: dialogsData } = messagesApi.useGetDialogsQuery()
  const { data: meData } = messagesApi.useMeQuery()
  const userId = meData?.userId

  const currentDialog = dialogsData?.items.find(
    item => item.receiverId === Number(query.id) || item.ownerId === Number(query.id)
  )

  const partnerId =
    currentDialog?.receiverId === userId ? currentDialog?.ownerId : currentDialog?.receiverId

  const avatarUrl = currentDialog?.avatars?.[0]?.url || ''

  return (
    <div
      className={
        'flex flex-col justify-between h-full w-[75%] border-[2px] border-dark-300 overflow-y-hidden'
      }
    >
      <div className={'w-full bg-dark-500 border-b border-dark-300 h-[72px] p-3 pt-4'}>
        {currentDialog ? (
          <UserProfile
            avatarUrl={avatarUrl}
            profileId={partnerId || 0}
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
        <div className={'h-full flex justify-center items-center'}>
          <div className={'py-3 px-6 rounded-lg bg-dark-300'}>
            <Typography variant={'medium-text'}>Choose who you would like to talk to</Typography>
          </div>
        </div>
      )}
    </div>
  )
}

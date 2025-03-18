import { messagesApi } from '@/common/api/messenger.api'
import { Avatar, Typography } from '@byte-creators/ui-kit'
import { CheckmarkOutline, DoneAllOutline } from '@byte-creators/ui-kit/icons'
import { cn } from '@byte-creators/utils'
import { useRouter } from 'next/router'

type Props = {
  imgMessage: boolean
  imgMessageWithoutText: boolean
  isOwner: boolean
  isReadMessage: boolean
  isReceivedMessage: boolean
  item: any
  voiceMessage: boolean
}

export const Message = ({
  imgMessage,
  imgMessageWithoutText,
  isOwner,
  isReadMessage,
  isReceivedMessage,
  item,
  voiceMessage,
}: Props) => {
  const { query } = useRouter()
  const { data } = messagesApi.useGetDialogsQuery()
  const currentDialog = data?.items.filter(item => item.ownerId === Number(query.id))[0]

  // Проверка на наличие blob в messageText (если это голосовое сообщение)
  const isVoiceMessage = item.messageText.startsWith('blob:')

  return (
    <div className={cn(['flex my-6 relative'], isOwner && 'justify-end')}>
      {!isOwner && (
        <Avatar
          avatarURL={currentDialog?.avatars?.[0]?.url || ''}
          isNextLink={false}
          linkContainerClassname={'w-[35px] mr-4'}
        />
      )}
      <div
        className={cn(
          ['max-w-80 h-fit rounded-lg  flex flex-col'],
          isOwner ? 'bg-primary-900' : 'bg-dark-300',
          imgMessageWithoutText && 'bg-transparent'
        )}
      >
        {imgMessage && (
          <img alt={'Image message'} className={'object-contain rounded-sm'} src={item.url} />
        )}
        {!imgMessageWithoutText ? (
          <Typography className={'px-3 mt-2'} variant={'regular-text'}>
            {isVoiceMessage ? (
              // Отображаем элемент audio для голосового сообщения
              <audio controls>
                <source src={item.messageText} type={'audio/webm'} />
                Your browser does not support the audio element.
              </audio>
            ) : (
              item.messageText
            )}
          </Typography>
        ) : null}

        <Typography
          className={cn([
            'flex pb-2 text-light-900 self-end mt-1',
            !imgMessageWithoutText && 'pr-3',
          ])}
          variant={'small-text'}
        >
          {new Date(item.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            hour12: false,
            minute: '2-digit',
          })}
          {isReceivedMessage && <CheckmarkOutline height={16} viewBox={'0 0 20 25'} width={16} />}
          {isReadMessage && <DoneAllOutline height={16} viewBox={'0 0 20 25'} width={16} />}
        </Typography>
      </div>
    </div>
  )
}

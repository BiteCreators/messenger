import { DialogsList } from '@/features/messenger/ui/DialogsList'
import { MessengerWindow } from '@/features/messenger/ui/MessengerWindow'
import { Typography } from '@byte-creators/ui-kit'

const Messenger = () => {
  return (
    <div className={'max-w-full h-[80vh] ml-6 mx-16 flex flex-col'}>
      <Typography className={'mb-3 text-2xl'} variant={'h1'}>
        Messenger
      </Typography>
      <div className={'flex min-h-[650px] max-w-[970px]'}>
        <DialogsList />
        <MessengerWindow />
      </div>
    </div>
  )
}

export default Messenger

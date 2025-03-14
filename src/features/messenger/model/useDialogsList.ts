import { messagesApi } from '@/common/api/messenger.api'
import { useRouter } from 'next/router'

export const useDialogsList = () => {
  const router = useRouter()
  const { data: meData } = messagesApi.useMeQuery()
  const userId = meData?.userId

  const { data, isLoading } = messagesApi.useGetDialogsQuery({
    searchName: router.query.search as string,
  })

  const handleUserClick = (receiverId: number) => {
    if (receiverId === userId) {
      console.error('You cannot open a dialog with yourself')

      return
    }

    router.push({
      query: `id=${receiverId}`,
    })
  }

  return {
    data,
    handleUserClick,
    isLoading,
    userId,
  }
}

import { messagesApi } from '@/common/api/messenger.api'
import { useRouter } from 'next/router'

export const useDialogsList = () => {
  const router = useRouter()

  console.log('useDialogsList', router.query.search)

  const { data, isLoading } = messagesApi.useGetDialogsQuery({
    searchName: router.query.search as string,
  })

  const handleUserClick = (userId: number) => {
    router.push({
      query: `id=${userId}`,
    })
  }

  return {
    data,
    handleUserClick,
    isLoading,
  }
}

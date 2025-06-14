import { useEffect, useRef } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { useIntersectionObserver } from '@byte-creators/utils'
import { useRouter } from 'next/router'

export const useDialogsList = () => {
  const router = useRouter()

  const triggerSearchUsersRef = useRef<HTMLLIElement | null>(null)

  const { data, isLoading } = messagesApi.useGetDialogsQuery({
    searchName: router.query.search as string,
  })
  const [getUsers, { data: searchUsers, reset }] = messagesApi.useLazyGetUsersQuery()
  const { data: me } = messagesApi.useMeQuery()
  const currentUserId = me?.userId
  let setSearchValue: (value: string) => void

  const handleTrigger = async () => {
    if (searchUsers?.nextCursor) {
      getUsers({ cursor: searchUsers?.nextCursor, search: router.query.search as string })
    }
  }

  useIntersectionObserver(triggerSearchUsersRef, handleTrigger)

  const handleSetSearchValue = (setValue: (value: string) => void) => {
    setSearchValue = setValue
  }

  const handleUserClick = (userData: { id?: number; name?: string }) => {
    if (userData.id) {
      router.push({
        pathname: '/messenger',
        query: { id: userData.id },
      })
    } else if (userData.name) {
      router.push({
        pathname: '/messenger',
        query: { name: userData.name },
      })
    }
    setSearchValue('')
  }

  const usersDialogsIds = data ? data.items.map(dialog => dialog.ownerId) : []
  const filterSearchUsers = searchUsers?.items.filter(user =>
    usersDialogsIds.includes(user.id) ? null : user
  )

  useEffect(() => {
    reset()
    if (router.query.search) {
      getUsers({ search: router.query.search as string })
    }
  }, [router.query.search])

  return {
    cursor: searchUsers?.nextCursor,
    data,
    filterSearchUsers,
    handleSetSearchValue,
    handleUserClick,
    isLoading,
    triggerSearchUsersRef,
    currentUserId,
  }
}

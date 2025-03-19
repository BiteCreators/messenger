import { useEffect, useState } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { useRouter } from 'next/router'

export const useMessengerWindow = () => {
  const { query } = useRouter()
  const [profileData, setProfileData] = useState({
    avatars: [{ url: '' }],
    userName: '',
  })

  const { data } = messagesApi.useGetDialogsQuery()
  const [getUsers] = messagesApi.useLazyGetUsersQuery()

  const setUserProfile = async (userName: string) => {
    const res = await getUsers({ search: userName })

    if (res.data) {
      setProfileData({
        avatars: res.data.items[0].avatars,
        userName: res.data.items[0].userName,
      })
    }
  }

  const currentUserId = 0

  const setCurrentDialog = (userId: number) => {
    const currentDialog = data?.items.filter(item =>
      item.receiverId === currentUserId ? item.ownerId === userId : item.receiverId === userId
    )[0]

    if (currentDialog) {
      setProfileData({
        avatars: currentDialog.avatars,
        userName: currentDialog.userName,
      })
    }
  }

  useEffect(() => {
    if (query.id) {
      setCurrentDialog(Number(query.id))
    }

    if (query.name) {
      setUserProfile(query.name as string)
    }
  }, [query.id, query.name])

  return {
    profileData,
    query,
  }
}

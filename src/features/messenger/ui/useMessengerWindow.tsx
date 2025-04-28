import { useEffect, useState } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { useRouter } from 'next/router'

export const useMessengerWindow = () => {
  const { query } = useRouter()
  const { data: me } = messagesApi.useMeQuery()

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

  const setCurrentDialog = (userId: number) => {
    if (!data || !me) return

    const currentDialog = data.items.find(item => {
      return item.receiverId === me.userId ? item.ownerId === userId : item.receiverId === userId
    })

    if (currentDialog) {
      setProfileData({
        avatars: currentDialog.avatars,
        userName: currentDialog.userName,
      })
    }
  }

  useEffect(() => {
    if (data && me && query.id) {
      setCurrentDialog(Number(query.id))
    } else if (query.name) {
      setUserProfile(query.name as string)
    }
  }, [data, me, query.id, query.name])

  return {
    profileData,
    query,
  }
}

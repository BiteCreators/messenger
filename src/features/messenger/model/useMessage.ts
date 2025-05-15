import { useState } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { MessageData } from '@/common/types/messenger.type'
import { useRouter } from 'next/router'

export const useMessage = (isOwner: boolean, item: MessageData) => {
  const { query } = useRouter()
  const dialoguePartnerId = Number(query.id) || 0
  const { data } = messagesApi.useGetDialogsQuery()
  const [deleteMessage] = messagesApi.useDeleteMessageMutation()
  const [alertMessage, setAlertMessage] = useState('')
  const currentDialog = data?.items.find(
    dialog => dialog.receiverId === Number(query.id) || dialog.ownerId === Number(query.id)
  )

  const handleDeleteMessage = async () => {
    if (!isOwner) {
      return
    }

    try {
      await deleteMessage({ id: item.id, dialoguePartnerId }).unwrap()
    } catch (error: any) {
      setAlertMessage(error?.data?.message || 'An unknown error occurred')
    }
  }

  const companionAvatarURL = currentDialog?.avatars?.[0]?.url || ''

  return {
    alertMessage,
    handleDeleteMessage,
    companionAvatarURL,
    currentDialog,
  }
}

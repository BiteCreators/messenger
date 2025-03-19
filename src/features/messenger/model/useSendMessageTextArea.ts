import React, { useEffect, useState } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { useTextArea } from '@byte-creators/utils'
import { useRouter } from 'next/router'

export const useSendMessageTextArea = (
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
) => {
  const { handleChange, textAreaId, textAreaRef } = useTextArea({
    onChange,
  })
  const [getUsers, { data: currentUser, reset }] = messagesApi.useLazyGetUsersQuery()

  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [textAriaValue, setTextAriaValue] = useState('')
  const router = useRouter()

  const [sendMessage] = messagesApi.useSendMessageMutation()
  const { data: messages } = messagesApi.useGetMessagesQuery({
    dialoguePartnerId: Number(router.query.id) || 0,
  })

  const handleSendMessage = () => {
    sendMessage({
      message: textAriaValue,
      receiverId: Number(router.query.id || currentUser?.items[0].id),
    })

    if (router.query.name) {
      router.push({
        pathname: router.pathname,
        query: { id: currentUser?.items[0].id },
      })
      reset()
    }

    setTextAriaValue('')
    setStep(0)
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAriaValue(e.currentTarget.value)
    handleChange(e)

    if (e.currentTarget.value.length !== 0) {
      setStep(1)
    } else {
      setStep(0)
    }

    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight
      }
    }, 50)
  }

  useEffect(() => {
    if (router.query.name) {
      getUsers({ search: router.query.name as string })
    }
  }, [router.query.name])

  return {
    handleSendMessage,
    handleTextAreaChange,
    messages,
    step,
    textAreaRef,
    textAriaValue,
  }
}

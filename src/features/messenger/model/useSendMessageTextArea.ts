import React, { useState } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { MessageType } from '@/common/types/messenger.type'
import { useTextArea } from '@byte-creators/utils'
import { useRouter } from 'next/router'

export const useSendMessageTextArea = (
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
) => {
  const { handleChange, textAreaId, textAreaRef } = useTextArea({
    onChange,
  })

  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [textAriaValue, setTextAriaValue] = useState('')
  const { query } = useRouter()
  const [sendMessage] = messagesApi.useSendMessageMutation()
  const { data: meData } = messagesApi.useMeQuery() // Получаем ваш ID
  const userId = meData?.userId

  const handleSendMessage = () => {
    const receiverId = Number(query.id)

    if (receiverId === userId) {
      console.error('You cannot send a message to yourself')

      return
    }

    sendMessage({ message: textAriaValue, receiverId })
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

  return {
    handleSendMessage,
    handleTextAreaChange,
    step,
    textAreaRef,
    textAriaValue,
  }
}

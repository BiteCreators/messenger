import React, { useState } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
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
  const { data } = messagesApi.useGetMessagesQuery({
    dialoguePartnerId: Number(query.id) || 0,
  })

  const handleSendMessage = () => {
    sendMessage({ message: textAriaValue, receiverId: Number(query.id) })
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
    data,
    handleSendMessage,
    handleTextAreaChange,
    step,
    textAreaRef,
    textAriaValue,
  }
}

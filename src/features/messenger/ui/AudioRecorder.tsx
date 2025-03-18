import { useRef, useState } from 'react'

import { messagesApi } from '@/common/api/messenger.api'
import { MessageType } from '@/common/types/messenger.type'
import { Button } from '@byte-creators/ui-kit'
import { useRouter } from 'next/router'

const mimeType = 'audio/webm'

type RecordingStatus = 'inactive' | 'paused' | 'recording'

export const AudioRecorder = () => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [permission, setPermission] = useState<boolean>(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('inactive')
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [audio, setAudio] = useState<null | string>(null)
  const { query } = useRouter()
  const [sendMessage] = messagesApi.useSendMessageMutation()
  const { data: meData } = messagesApi.useMeQuery()
  const userId = meData?.userId

  const getMicrophonePermission = async (): Promise<void> => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

        setPermission(true)
        setStream(streamData)
      } catch (err: any) {
        alert(err.message)
      }
    } else {
      alert('API MediaRecorder не поддерживается в вашем браузере.')
    }
  }

  const startRecording = async (): Promise<void> => {
    getMicrophonePermission()
    if (!stream) {
      return
    }

    setRecordingStatus('recording')
    const media = new MediaRecorder(stream, { mimeType: mimeType })

    mediaRecorder.current = media
    mediaRecorder.current.start()
    const localAudioChunks: Blob[] = []

    mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
      if (typeof event.data === 'undefined' || event.data.size === 0) {
        return
      }
      localAudioChunks.push(event.data)
    }
    setAudioChunks(localAudioChunks)
  }

  const stopRecording = (): void => {
    if (!mediaRecorder.current) {
      return
    }

    setRecordingStatus('inactive')
    mediaRecorder.current.stop()
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType })
      const audioUrl = URL.createObjectURL(audioBlob)

      setAudio(audioUrl)
      setAudioChunks([])
    }
  }

  const handleSendVoiceMessage = async () => {
    if (!audio) {
      console.error('No audio to send')

      return
    }

    const receiverId = Number(query.id)

    if (receiverId === userId) {
      console.error('You cannot send a message to yourself')

      return
    }
    //audio === blob:http://localhost:3001/b1c23f1f-5df9-4424-af86-91c7d21abd66
    //преобразовать в base64

    sendMessage({
      message: audio,
      receiverId,
    })

    setAudio(null)
  }

  return (
    <div className={'z-50 h-20 px-3 pb-5'}>
      <div className={'flex'}>
        {recordingStatus === 'inactive' ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : null}
        {recordingStatus === 'recording' ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : null}
      </div>
      {audio ? (
        <div>
          <audio controls src={audio}></audio>
          <div className={'gap-3'}>
            <Button onClick={handleSendVoiceMessage}>Send</Button>
            <a download href={audio}>
              Download Recording
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}

import React, { forwardRef } from 'react'

import { useSendMessageTextArea } from '@/features/messenger/model/useSendMessageTextArea'
import { Alert, Button, TextArea } from '@byte-creators/ui-kit'
import { mergeRefs } from '@byte-creators/utils'
import styles from './styles/SendMessageTextArea.module.css'

type Props = {
  disabled?: boolean
  error?: string
  id?: string
  isCorrect?: boolean
  limitCount?: number
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
}

export const SendMessageTextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ disabled, error, id, isCorrect, limitCount, onChange, required }, ref) => {
    const { handleSendMessage, handleTextAreaChange, messages, step, textAreaRef, textAriaValue } =
      useSendMessageTextArea(onChange)

    return (
      <div className={styles.componentWrapper}>
        {/*{messages?.items.length && step === 1 ? (*/}
        {/*  <div className={'flex mt-3 mb-1 mx-3'}>*/}
        {/*    /!*<ScrollArea className={'max-w-[300px] w-auto'} orientation={'horizontal'}>*!/*/}
        {/*    <ul className={'flex gap-3'}>*/}
        {/*      {messages?.items.map(el => (*/}
        {/*        <li className={'relative'} key={el.id}>*/}
        {/*          <img alt={'Image'} className={'rounded-[2px] max-h-9 overflow-hidden'} src={''} />*/}
        {/*          <button*/}
        {/*            className={*/}
        {/*              'top-0 right-0 p-0 w-4 h-4 bg-dark-900 bg-opacity-[0.5] rounded-sm absolute'*/}
        {/*            }*/}
        {/*            onClick={() => {}}*/}
        {/*          >*/}
        {/*            <CloseOutlineSmall height={20} viewBox={'0 0 15 15'} width={20} />*/}
        {/*          </button>*/}
        {/*        </li>*/}
        {/*      ))}*/}
        {/*    </ul>*/}
        {/*    /!*</ScrollArea>*!/*/}
        {/*    <div className={'flex items-center justify-center mt-1'}>*/}
        {/*      <DragAndDropInput onFileSelect={() => {}}>*/}
        {/*        <button className={'ml-3'} disabled={false} onClick={() => {}}>*/}
        {/*          <PlusCircleOutlineBig height={25} viewBox={'0 0 35 35'} width={25} />*/}
        {/*        </button>*/}
        {/*      </DragAndDropInput>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*) : null}*/}
        <div className={styles.flexWrapper}>
          <div className={styles.textareaWrapper}>
            <TextArea
              className={styles.textarea}
              disabled={disabled}
              isCorrect={isCorrect}
              limitCount={limitCount}
              maxLength={999}
              onChange={handleTextAreaChange}
              placeholder={'Type message'}
              ref={mergeRefs([ref, textAreaRef])}
              value={textAriaValue}
            />
          </div>
          <div
            className={styles.buttonWrapper}
            style={step === 1 ? { alignItems: 'baseline' } : {}}
          >
            {/*{step === 0 && (*/}
            {/*  <div className={'pb-2 pr-5 flex flex-row-reverse gap-4 w-full'}>*/}
            {/*    <button>*/}
            {/*      <ImageOutline />*/}
            {/*    </button>*/}
            {/*    <button>*/}
            {/*      <MicOutline />*/}
            {/*    </button>*/}
            {/*  </div>*/}
            {/*)}*/}
            {(step === 1 || step === 2) && (
              <Button className={styles.button} onClick={handleSendMessage} variant={'text'}>
                <span>{step === 1 ? 'Send message' : 'Send voice'}</span>
              </Button>
            )}
            {error && <Alert canClose={false} message={error} purpose={'toast'} type={'error'} />}
          </div>
        </div>
      </div>
    )
  }
)

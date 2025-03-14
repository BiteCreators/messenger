import React, { forwardRef } from 'react'

import { useSendMessageTextArea } from '@/features/messenger/model/useSendMessageTextArea'
import { Alert, Button, DragAndDropInput, TextArea, Typography } from '@byte-creators/ui-kit'
import {
  CloseOutlineSmall,
  ImageOutline,
  MicOutline,
  PlusCircleOutlineBig,
} from '@byte-creators/ui-kit/icons'
import { cn, mergeRefs } from '@byte-creators/utils'

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
    const { data, handleSendMessage, handleTextAreaChange, step, textAreaRef, textAriaValue } =
      useSendMessageTextArea(onChange)

    return (
      <div className={'w-full flex flex-col bg-dark-700 border-t border-dark-300'}>
        {data?.items.length && step === 1 ? (
          <div className={'flex mt-3 mb-1 mx-3'}>
            {/*<ScrollArea className={'max-w-[300px] w-auto'} orientation={'horizontal'}>*/}
            <ul className={'flex gap-3'}>
              {data?.items.map(el => (
                <li className={'relative'} key={el.id}>
                  <img alt={'Image'} className={'rounded-[2px] max-h-9 overflow-hidden'} src={''} />
                  <button
                    className={
                      'top-0 right-0 p-0 w-4 h-4 bg-dark-900 bg-opacity-[0.5] rounded-sm absolute'
                    }
                    onClick={() => {}}
                  >
                    <CloseOutlineSmall height={20} viewBox={'0 0 15 15'} width={20} />
                  </button>
                </li>
              ))}
            </ul>
            {/*</ScrollArea>*/}
            <div className={'flex items-center justify-center mt-1'}>
              <DragAndDropInput onFileSelect={() => {}}>
                <button className={'ml-3'} disabled={false} onClick={() => {}}>
                  <PlusCircleOutlineBig height={25} viewBox={'0 0 35 35'} width={25} />
                </button>
              </DragAndDropInput>
            </div>
          </div>
        ) : null}
        <div className={'flex'}>
          <div className={'h-auto w-full'}>
            <TextArea
              className={cn([
                'text-light-100 text-md bg-dark-100 leading-tight',
                'border-none h-9 py-3 pl-5',
                'focus:!outline-none',
                // mockImages.length ? 'max-h-[120px]' : 'max-h-32',
                'active:focus:outline-none active:outline-none',
                'bg-transparent',
              ])}
              disabled={disabled}
              isCorrect={isCorrect}
              limitCount={limitCount}
              maxLength={limitCount}
              onChange={handleTextAreaChange}
              placeholder={'Type message'}
              ref={mergeRefs([ref, textAreaRef])}
              value={textAriaValue}
            />
          </div>
          <div
            className={cn(
              'mx-2 flex py-2 h-full relative whitespace-nowrap',
              step === 1 && 'items-baseline'
            )}
          >
            {step === 0 && (
              <div className={'pb-2 pr-5 flex flex-row-reverse gap-4 w-full'}>
                <button>
                  <ImageOutline />
                </button>
                <button>
                  <MicOutline />
                </button>
              </div>
            )}
            {(step === 1 || step === 2) && (
              <Button
                className={'w-full text-center px-6'}
                onClick={handleSendMessage}
                variant={'text'}
              >
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

export enum MessageType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  VOICE = 'VOICE',
}
export enum MessageStatus {
  READ = 'READ',
  RECEIVED = 'RECEIVED',
  SENT = 'SENT',
}

type ParamsRequest = {
  cursor?: number
  pageSize?: number
  searchName?: string
}
export type DialogsRequest = ParamsRequest
export type MessagesRequest = { dialoguePartnerId: number } & ParamsRequest
export type SendMessageRequest = {
  message: string
  receiverId: number
}
export type UpdateMessageRequest = {
  id: number
  message: string
}

export type Avatar = {
  createdAt: string
  fileSize: number
  height: number
  url: string
  width: number
}
export type Message = {
  createdAt: string
  id: number
  messageText: string
  messageType: MessageType
  ownerId: number
  receiverId: number
  status: MessageStatus
  updatedAt: string
}
export type Dialog = {
  avatars: Avatar[]
  userName: string
} & Message
export type Error = {
  error: string
  message: string
}

type BaseResponse<T> = {
  items: T[]
  notReadCount: number
  pageSize: number
  totalCount: number
}

export type DialogsResponse = BaseResponse<Dialog>
export type MessagesResponse = BaseResponse<Message>

export type MeResponse = {
  email: string
  isBlocked: boolean
  userId: number
  userName: string
}

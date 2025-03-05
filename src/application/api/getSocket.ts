import { Socket, io } from 'socket.io-client'

let socket: Socket

/**
 * @returns socket io instance
 */
export const getSocket = () => {
  if (!socket) {
    const queryParams = {
      query: {
        accessToken: document.cookie.split('accessToken=')[1],
      },
    }

    socket = io(process.env.NEXT_PUBLIC_WS_API_URL || '', queryParams)
  }

  if (socket.disconnected) {
    socket.connect()
  }

  return socket
}

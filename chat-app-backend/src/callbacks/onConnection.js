import onDisconnect from './onDisconnect'
import onSendMessage from './onSendMessage'

export default async (socket) => {
    // eslint-disable-next-line no-console
    console.log('Socket connected')
    socket.join(`user-${socket.user._id}`)

    socket.on('disconnect', onDisconnect.bind(null, socket))
    socket.on('sendMessage', (message) =>
        onSendMessage.call(null, socket, message)
    )
}

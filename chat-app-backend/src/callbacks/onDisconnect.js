export default async (socket) => {
    // eslint-disable-next-line no-console
    console.log('Disconnect')
    socket.broadcast.emit('leftUser', socket.user._id)
    socket.leave(`user-${socket.user._id}`)
    delete socket.user
}

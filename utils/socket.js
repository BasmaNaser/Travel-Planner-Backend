const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: { origin: '*' }
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error('Authentication required'));
            }

            socket.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            next();
        } catch (error) {
            next(new Error('Invalid or expired token'));
        }
    });

    io.on('connection', (socket) => {
        const { id, role } = socket.user;

        if (role === 'admin') {
            socket.join('admins');
        } else {
            socket.join(`user:${id}`);
        }

        console.log(`Socket connected: ${role} ${id}`);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${role} ${id}`);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io is not initialized');
    }
    return io;
}

module.exports = { initSocket, getIO };
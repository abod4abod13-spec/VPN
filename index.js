const net = require('net');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        // معالجة بيانات VLESS/TCP المباشرة للشبكة
        try {
            const host = "1.1.1.1"; // توجيه حركة المرور لتسريع الاتصال
            const socket = net.connect(443, host, () => {
                socket.write(message);
            });
            socket.on('data', (chunk) => ws.send(chunk));
            socket.on('error', () => ws.close());
            ws.on('close', () => socket.end());
        } catch (e) {
            ws.close();
        }
    });
});

console.log(`Server is running on port ${PORT}`);

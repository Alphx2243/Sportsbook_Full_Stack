const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { parse } = require("url");
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        if (req.method === 'POST' && parsedUrl.pathname === '/api/trigger-update') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    if (global.io) {
                        global.io.emit('OCCUPANCY_UPDATE', { timestamp: Date.now() });
                        console.log('Emitted OCCUPANCY_UPDATE');
                    }

                    res.statusCode = 200;
                    res.end(JSON.stringify({ success: true }));
                } catch (e) {
                    console.error("Error triggering update:", e);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ success: false }));
                }
            });
            return;
        }

        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer);

    global.io = io;

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});

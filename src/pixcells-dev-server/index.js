const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
        const filePath = path.join(__dirname, "index.html");
        const readStream = fs.createReadStream(filePath);
        res.writeHead(200, { "Content-Type": "text/html" });
        readStream.pipe(res);
    } else if (req.url === "/pixcells-core.js") {
        const filePath = path.join(__dirname, "..", "pixcells-core", "index.js");
        const readStream = fs.createReadStream(filePath);
        res.writeHead(200, { "Content-Type": "text/html" });
        readStream.pipe(res);
    } else if (req.url === "/tools/pencilTool.js") {
        const filePath = path.join(__dirname, "..", "pixcells-core", "tools", "pencilTool.js");
        const readStream = fs.createReadStream(filePath);
        res.writeHead(200, { "Content-Type": "text/html" });
        readStream.pipe(res);
    } else if (req.url === "/tools/eraserTool.js") {
        const filePath = path.join(__dirname, "..", "pixcells-core", "tools", "eraserTool.js");
        const readStream = fs.createReadStream(filePath);
        res.writeHead(200, { "Content-Type": "text/html" });
        readStream.pipe(res);
    } else if (req.url === "/utils/hexToRGBA.js") {
        const filePath = path.join(__dirname, "..", "pixcells-core", "utils", "hexToRGBA.js");
        const readStream = fs.createReadStream(filePath);
        res.writeHead(200, { "Content-Type": "text/html" });
        readStream.pipe(res);
    } else if (req.url === "/utils/createTempCanvasWithImageData.js") {
        const filePath = path.join(__dirname, "..", "pixcells-core", "utils", "createTempCanvasWithImageData.js");
        const readStream = fs.createReadStream(filePath);
        res.writeHead(200, { "Content-Type": "text/html" });
        readStream.pipe(res);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

const port = 3000;

server.listen(3001, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

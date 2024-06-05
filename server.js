const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3001; // Atualize a porta para 3001 para corresponder ao código do cliente

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/generate-message') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Converte o buffer para string
        });

        req.on('end', () => {
            try {
                const { prompt } = JSON.parse(body);

                // Aqui você pode adicionar a lógica para gerar a mensagem
                const generatedMessage = `Mensagem gerada para o nicho: ${prompt}`;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: generatedMessage }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request payload' }));
            }
        });

    } else {
        let filePath = '.' + req.url;
        if (filePath == './') {
            filePath = './index.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    fs.readFile('./404.html', (error, content) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    });
                } else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                    res.end();
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

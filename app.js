//  npm run watch

import { readdir, readFile, unlink } from 'fs/promises';
import CsvToJson from './index.js';
import http from 'http';
import path from 'path';

const PORT = 3000;

const server = http.createServer();
server.on('request', async (req, res) => {
    const items = req.url.split('/');

    if (req.method === 'POST' && items[1] === 'exports') {
        try {
            const body = await getRequestBody(req);
            const { directoryPath } = JSON.parse(body);

            await CsvToJson(directoryPath);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'CSV files converted and saved.' }));
        } catch (err) {
            console.error('Error converting CSV files:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to convert CSV files.' }));
        }
    } else if (req.method === 'GET' && items[1] === 'files') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (items.length === 3 && req.url.startsWith('/files/')) {
            const filename = items[2];
            const filePath = path.join('./converted', filename);
            try {
                const data = await readFile(filePath, 'utf-8');
                const jsonData = JSON.parse(data);

                res.statusCode = 200;
                res.end(JSON.stringify(jsonData));
            } catch (err) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'File not found.' }));
            }
        } else {
            res.end(JSON.stringify(jsonFileArray));
        }
    } else if (req.method === 'DELETE' && items[1] === 'files') {
        const filename = items[2];
        const filePath = path.join('./converted', filename);
        try {
            await unlink(filePath);
            console.log(`File "${filename}" deleted successfully.`);
        } catch (err) {
            console.error(`Error deleting file "${filename}":`, err);
        }
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Route not found.' }));
    }
});


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})









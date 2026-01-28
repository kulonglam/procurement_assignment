const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const server = http.createServer((req, res) => {
    if (req.url === '/kgl/procurement' && req.method === 'GET') {
        fs.readFile("data.json", (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });

                return res.end(JSON.stringify({ error: 'Failed to read data' }));
            }
            else {
                let procurements;
                try {
                    procurements = JSON.parse(data);
                } catch (parseError) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Failed to parse data' }));
                }
                if (procurements.length === 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'No data found' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(procurements));
            }
        });

    } else if (req.url === '/kgl/procurement' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newProcurement = JSON.parse(body);
                fs.readFile("data.json", (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Failed to read data' }));
                    }
                    let procurements;
                    try {
                        procurements = JSON.parse(data);
                    } catch (parseError) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Failed to parse data' }));
                    }
                    procurements.push(newProcurement);
                    fs.writeFile("data.json", JSON.stringify(procurements, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Failed to write data' }));
                        }
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Procurement added successfully' }));
                    });
                });
            } catch (parseError) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`KGL Procurement API running on port ${PORT}`);
});

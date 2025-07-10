const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const mysql = require('mysql2');

const publicDir = path.join(__dirname, 'public');
const PORT = 3000;

// Koneksi ke MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'guru_les'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal!');
        process.exit();
    }
    console.log('Koneksi ke database berhasil!');
});

// Server
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const filePath = req.url === '/' ? '/index.html' : req.url;
        const fullPath = path.join(publicDir, filePath);
        fs.readFile(fullPath, (err, content) => {
            if (err) {
                res.writeHead(404);
                return res.end('File tidak ditemukan');
            }

            const ext = path.extname(fullPath);
            const contentType = ext === '.css' ? 'text/css' :
                                ext === '.js' ? 'text/javascript' :
                                ext === '.html' ? 'text/html' : 'text/plain';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });

    } else if (req.method === 'POST' && req.url === '/contact') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const parsed = parse(body);
            const {student_name, email, tutor_name, message} = parsed;

            const sql = 'INSERT INTO guru_les (student_name, email, tutor_name, message) VALUES (?, ?, ?, ?)';
            db.query(sql, [student_name, email, tutor_name, message], (err) => {
                if (err) {
                    console.error('Gagal menyimpan ke database:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Gagal menyimpan data');
                }

                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Data berhasil disimpan ke database!');
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
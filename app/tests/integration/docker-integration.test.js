const http = require('http');

const BACKEND = 'http://localhost:3001', 
FRONTEND = 'http://localhost:3000';

const GET = (url) => new Promise((res, rej) => {
    const req = http.get(url, (r) => {
        let d = '';
        r.on('data', chunk => d += chunk);
        r.on('end', () => res({ status: r.statusCode, body: d }));
    }).on('error', rej);
    req.setTimeout(5000, () => req.destroy(new Error('Timeout')));
});

async function wait(url, name) {
    console.log(`Waiting for ${name}...`);
    for (let i = 0; i < 30; i++) {
        try {
            const r = await GET(url);
            if (r.status === 200) return r;
        } catch (e) {}
        await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error(`${name} unreachable`);
}

async function run() {
    try {
        // Test 1: Health
        const h = await wait(`${BACKEND}/health`, 'Backend');
        const healthData = JSON.parse(h.body);
        
        console.log('Réponse reçue du Health:', healthData); // <--- LIGNE DE DEBUG

        // On accepte "ok" ou "OK"
        if (healthData.status.toLowerCase() !== 'ok') {
            throw new Error(`Status attendu 'ok', reçu '${healthData.status}'`);
        }
        console.log('✅ Health OK');

        // Test 2: API & DB
        const a = await wait(`${BACKEND}/api/status`, 'API/Database');
        console.log('Réponse reçue de l\'API:', a.body); // <--- LIGNE DE DEBUG
        
        const api = JSON.parse(a.body);
        if (api.status !== 'success') throw new Error('API Error');
        console.log('✅ API & Database OK');

        process.exit(0);
    } catch (e) {
        console.error(`❌ FAILED: ${e.message}`);
        if (e.stack) console.error(e.stack);
        process.exit(1);
    }
}

run();
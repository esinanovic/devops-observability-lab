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
        const healthBody = JSON.parse(h.body);
        if (healthBody.status.toLowerCase() !== 'ok') throw new Error('Health NOT OK');
        console.log('Health OK');

        // Test 2: API & DB (C'est ici qu'on attend que la DB réponde enfin 200)
        const a = await wait(`${BACKEND}/api/status`, 'API/Database');
        const api = JSON.parse(a.body);
        if (api.status !== 'success') throw new Error('API Error');
        console.log('API & Database OK');

        // Test 3: Frontend
        await wait(FRONTEND, 'Frontend');
        console.log('Frontend OK');

        process.exit(0);
    } catch (e) {
        console.error(`FAILED: ${e.message}`);
        process.exit(1);
    }
}

run();
const express = require('express');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7860;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to make HTTPS requests to Resend
function resendRequest(apiKey, path, method, postData = null) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'api.resend.com',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            }
        };

        if (postData) {
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, error: 'Failed to parse JSON response', raw: body });
                }
            });
        });

        req.on('error', (e) => resolve({ statusCode: 500, error: e.message }));
        
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

// Endpoint to fetch received emails for multiple keys
app.post('/api/check-replies', async (req, res) => {
    const { apiKeys } = req.body;
    if (!apiKeys || !Array.isArray(apiKeys)) {
        return res.status(400).json({ error: 'apiKeys array is required' });
    }

    const allReplies = [];
    
    for (let i = 0; i < apiKeys.length; i++) {
        const key = apiKeys[i];
        if (!key) continue;

        try {
            // 1. Get list of received emails
            const response = await resendRequest(key, '/emails/receiving', 'GET');
            if (response.statusCode === 200 && response.data && response.data.data) {
                const emails = response.data.data;
                
                // For each received email, query details to get the body snippet if possible
                for (const email of emails) {
                    // Let's add key details so we know which inbox it came to
                    allReplies.push({
                        id: email.id,
                        from: email.from,
                        to: email.to,
                        subject: email.subject,
                        created_at: email.created_at,
                        keyIndex: i + 1,
                        apiKey: key // return it so the client knows which key to use to reply
                    });
                }
            }
        } catch (e) {
            console.error(`Error checking replies for key index ${i}:`, e.message);
        }
    }

    // Sort replies: newest first
    allReplies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({ replies: allReplies });
});

// Endpoint to send a reply
app.post('/api/send-reply', async (req, res) => {
    const { apiKey, from, to, subject, text } = req.body;
    if (!apiKey || !from || !to || !subject || !text) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const postData = JSON.stringify({
        from,
        to: [to],
        subject,
        text
    });

    try {
        const response = await resendRequest(apiKey, '/emails', 'POST', postData);
        if (response.statusCode === 200 || response.statusCode === 201) {
            res.json({ success: true, data: response.data });
        } else {
            res.status(response.statusCode).json({ error: response.data || 'Failed to send email' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Serve UI index on all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Resend Cloud Dashboard running on port ${PORT}`);
});

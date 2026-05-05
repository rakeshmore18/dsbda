const http = require('http');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const IPYNB_DIR = __dirname;

// Initialize the official Google SDK with your API key
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyAVK40DFU-_7-xH9SUBdhmlc4NrJd_kIzI';
const genAI = new GoogleGenerativeAI(apiKey);

async function askQuestion(question) {
    try {
        // Using the officially supported 'gemini-flash-latest' alias 
        // to automatically resolve to the correct model version and avoid 404 errors.
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const result = await model.generateContent(question);
        return result.response.text();
    } catch (error) {
        return "Gemini API Error: " + error.message;
    }
}

const handler = async (req, res) => {
    if (req.url === '/favicon.ico') {
        res.writeHead(204);
        return res.end();
    }

    // AI Question Endpoint
    if (req.url.startsWith('/q?')) {
        let question = decodeURIComponent(req.url.substring(req.url.indexOf('?') + 1));

        // Handle formats like /q?question or /q?=question or /q?q=question
        if (question.startsWith('=')) question = question.slice(1);
        if (question.startsWith('q=')) question = question.slice(2);

        // Fetch answer from free AI
        askQuestion(question).then(answer => {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(answer);
        }).catch(err => {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Request Failed: ' + err.message);
        });
        return;
    }

    // Direct download endpoint (triggered invisibly)
    if (req.url.startsWith('/dl/')) {
        const filename = decodeURIComponent(req.url.slice(4));
        const filepath = path.join(IPYNB_DIR, filename);

        if (!filepath.startsWith(IPYNB_DIR)) {
            res.writeHead(403);
            return res.end('Forbidden');
        }

        if (fs.existsSync(filepath)) {
            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Type': 'application/x-ipynb+json',
            });
            return fs.createReadStream(filepath).pipe(res);
        } else {
            res.writeHead(404);
            return res.end('File not found');
        }
    }

    // Main entry point when user types http://localhost:3000/filename.ipynb
    if (req.url !== '/') {
        const filename = decodeURIComponent(req.url.slice(1));

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <body style="background: black;">
                <script>
                    // 1. Trigger the download invisibly
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = '/dl/' + encodeURIComponent('${filename}');
                    document.body.appendChild(iframe);

                    // 2. Wipe the address bar and attempt to close the tab
                    setTimeout(() => {
                        // This forcefully replaces the URL in the address bar with "about:blank"
                        window.location.replace('about:blank');
                        
                        // Try to close the tab
                        try { window.close(); } catch(e) {}
                    }, 500);
                </script>
            </body>
            </html>
        `);
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Server running.');
    }
};

// Export the handler for Vercel Serverless deployment
module.exports = handler;

// Start the server locally only if we aren't in a serverless environment
if (require.main === module) {
    const server = http.createServer(handler);
    server.listen(PORT, () => {
        console.log(`\n=======================================================`);
        console.log(`🚀 Server running at http://localhost:${PORT}/`);
        console.log(`📂 Serving files from: ${IPYNB_DIR}`);
        console.log(`=======================================================\n`);
    });
}

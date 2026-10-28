# AI Code Review Assistant (deployable version)

Human-in-the-loop AI code review. The AI (Google Gemini) suggests; the developer verifies. Every result shows **"AI Suggestions — Verify Before Use"**.

- `index.html` is the whole website (HTML, CSS, JavaScript).
- `api/analyze.js` is a serverless function that calls Gemini. The API key stays on the server.
- Review history is saved in the visitor's browser (localStorage). It is not a database and is not shared.

## Run on your computer (Windows + VS Code)
1. Install **Node.js LTS** from https://nodejs.org and **VS Code** from https://code.visualstudio.com.
2. Extract the ZIP. In VS Code choose **File > Open Folder...** and pick the `ai-code-review-assistant` folder.
3. Open the terminal: **Terminal > New Terminal**.
4. Create your settings file: `copy .env.example .env`
5. Open `.env` and replace `your_gemini_api_key_here` with your key from https://aistudio.google.com (Get API key). No quotes, no spaces.
6. Start the app: `npm start` (nothing to install).
7. Open http://localhost:3000 in your browser. Stop the server with `Ctrl + C`.
After changing `.env`, stop the server and run `npm start` again.

## Upload to GitHub
1. Create a free account at https://github.com and click **New repository** (name: `ai-code-review-assistant`).
2. Extract the ZIP. On the repository page click **uploading an existing file** and drag in everything from inside the extracted folder (`index.html`, `api`, `package.json`, `vercel.json`, `.env.example`, `.gitignore`, `README.md`). Click **Commit changes**.
3. Never upload a real key. Only `.env.example` (placeholders) belongs in the repository.

## Deploy on Vercel (free)
1. Get a Gemini key at https://aistudio.google.com (Get API key).
2. Go to https://vercel.com, sign in with GitHub, click **Add New > Project**, and import the repository.
3. Before clicking Deploy, open **Environment Variables** and add `GEMINI_API_KEY` with your key. Optionally add `GEMINI_MODEL` (see the models page above).
4. Click **Deploy**. Vercel gives you a public link like `https://your-project.vercel.app`.
5. If you add or change a variable later, redeploy the project.

## Test it
Open your link, go to **New Code Review**, load a sample, and click **Analyze Code**. Save it, edit notes, mark it Verified, and delete it.

## Common problems
| Problem | Fix |
|---|---|
| `'npm' is not recognized` | Install Node.js, then close and reopen VS Code. |
| Port 3000 already in use | Run `set PORT=3001 && npm start`, then open http://localhost:3001. |
| "The server has no Gemini API key" | Add `GEMINI_API_KEY` in Vercel Settings > Environment Variables, then redeploy. |
| "Gemini rejected the request" | Key is wrong or revoked. Create a new one. |
| "model ... was not found" | Set `GEMINI_MODEL` to a current ID from Google's models page. |
| Quota or rate limit message | Wait a minute, or check your limits in Google AI Studio. |
| Request times out | Use shorter code. Free hosting limits how long a function may run. |

## Important limits
- Anyone with your public link can use your Gemini quota. Keep the link to your seminar audience, and watch your usage in Google AI Studio. Delete or rotate the key after the event if you like.
- There is no login and no shared database. For MongoDB storage, use the full-stack project from the earlier ZIP.
- AI output can be wrong or incomplete. It does not guarantee code is bug-free, secure, or production-ready.

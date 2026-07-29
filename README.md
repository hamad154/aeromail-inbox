# AeroMail Cloud Inbox Dashboard

This dashboard is designed to run 24/7 on **Hugging Face Spaces** for free, allowing you to sync inbound replies across your 4 Resend keys/domains and reply to your leads directly from a premium cloud dashboard (accessible from your PC or mobile phone).

---

## 🚀 How to Deploy on Hugging Face (100% Free)

1. **Create a Hugging Face Account**:
   If you don't have one, register for free at [huggingface.co](https://huggingface.co/).

2. **Create a New Space**:
   * Go to: **[huggingface.co/new-space](https://huggingface.co/new-space)**
   * **Space Name**: Give it a custom name (e.g. `aeromail-inbox-hub`).
   * **SDK**: Select **Docker** (very important!).
   * **Docker Template**: Select **Blank** (default).
   * **Visibility**: Select **Public** or **Private** (Private is recommended to keep your dashboard secure, but either works).
   * Click **Create Space**.

3. **Upload Files**:
   * On your new Space page, click the **Files** tab at the top.
   * Click **Add file** ➡️ **Upload files**.
   * Drag and drop the following files/folders from this local directory (`c:\Users\HAMADHASSAN\Desktop\mailing\huggingface-space`):
     - `Dockerfile`
     - `package.json`
     - `server.js`
     - `public/index.html` (make sure it's placed inside a `public/` directory in the Space files!)
   * Commit the changes to the Space.

4. **Start the Dashboard**:
   * Hugging Face will automatically detect the `Dockerfile` and build your container (takes 1–2 minutes).
   * Once built, your Space will say **Running** 🟢.
   * Open the Space app tab to view your dashboard!

---

## 🔒 Security & Usage

* **Local Storage Keys**: For maximum security, your Resend API keys are stored **only inside your own browser's LocalStorage**. They are never saved on the server-side, keeping your keys 100% safe.
* **Responsive Design**: You can open the Space URL on your smartphone and sync/reply to emails on the go!
* **Rotated Sender Addresses**: When replying to a lead, the dashboard automatically routes your reply through the correct Resend API key and matching verified domain name!

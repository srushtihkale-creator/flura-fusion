# Flora Fusion — Promotional Email Campaign Automation with n8n Cloud & Gmail SMTP

This directory contains the production-ready n8n Cloud workflow for Flora Fusion's promotional email campaigns.

---

## 🌟 Architecture Overview

```
[ Flora Fusion Admin Dashboard ]
               │
               ▼
   [ Spring Boot Backend ] ──(Generates Campaign & Enforces Marketing Consent)
               │
               ▼ (POST Webhook with X-Flora-Secret)
   [ n8n Cloud Workflow ]
               │
               ├─► [ Spring Boot /api/v1/internal/campaigns/{id}/recipients ]
               │     (Retrieves ONLY opted-in, non-unsubscribed customers)
               │
               ├─► [ SplitInBatches (Size 1) + 1.5s Throttling ]
               │
               ├─► [ Send Email Node via Gmail SMTP (App Password) ]
               │
               ├─► [ POST /api/v1/internal/campaigns/{id}/log ] (Atomic Per-Recipient Logging)
               │
               └─► [ POST /api/v1/internal/campaigns/{id}/complete ] (Final Aggregation)
```

---

## 📋 File Deliverables

- `flora_fusion_promotional_email_workflow.json`: The complete workflow ready to import directly into n8n Cloud.

---

## 🔐 Configuration & Credentials Setup

### Step 1: Create a Google App Password for Gmail SMTP
1. Log in to your Google Account: [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Ensure **2-Step Verification** is turned ON.
3. In the search bar at top of Google Account, type **"App passwords"** and click on it.
4. Enter an app name: `Flora Fusion n8n` and click **Create**.
5. Google will generate a **16-character password** (e.g., `abcd efgh ijkl mnop`).
6. Copy and save this password safely. *(Do not share or commit this password)*.

---

### Step 2: Configure n8n Cloud SMTP Credentials
1. In n8n Cloud dashboard, click **Credentials** on the left sidebar.
2. Click **Add Credential** ➔ Search for **SMTP**.
3. Fill in the connection settings:
   - **Credential Name**: `Flora Fusion Gmail SMTP`
   - **User**: `srushti.h.kale2004@gmail.com` (Your Gmail address)
   - **Password**: `<Your 16-character Google App Password>`
   - **Host**: `smtp.gmail.com`
   - **Port**: `465` (or `587`)
   - **SSL/TLS**: `SSL/TLS` (for port 465) or `STARTTLS` (for port 587)
4. Click **Save & Test Connection**.

---

### Step 3: Configure n8n Cloud Environment Variables
In your n8n Cloud project settings (under **Settings** ➔ **Variables** or Environment Configuration):

| Variable Name | Description | Example / Production Value |
| :--- | :--- | :--- |
| `FLORA_BACKEND_URL` | Base URL of Flora Fusion Spring Boot backend | `https://flora-fusion-backend.onrender.com` (or `http://localhost:8080`) |
| `FLORA_N8N_WEBHOOK_SECRET` | Shared secret to authenticate Spring Boot ➔ n8n webhook calls | `flora_n8n_secret_change_in_production` (strong random string) |
| `FLORA_INTERNAL_SECRET` | Shared secret for n8n ➔ Spring Boot internal recipient/log APIs | `flora_dev_secret_change_in_production` (strong random string) |
| `GMAIL_SENDER_EMAIL` | Sender address visible in customer inboxes | `srushti.h.kale2004@gmail.com` |

---

### Step 4: Import the Workflow
1. In n8n Cloud, click **Workflows** ➔ **Add Workflow**.
2. Click the three dots `...` in the top-right corner ➔ Select **Import from File**.
3. Select `flora_fusion_promotional_email_workflow.json`.
4. Double check the **Webhook Trigger** node.
5. In the **Send Promotional Email (Gmail SMTP)** node, select your credential `Flora Fusion Gmail SMTP`.
6. Toggle the workflow to **Active**.
7. Copy the production Webhook URL from the Webhook node:
   `https://<your-n8n-instance>.app.n8n.cloud/webhook/flora-campaign`

---

### Step 5: Configure Spring Boot Backend (Render / application.yml)
Set these environment variables on your Render Spring Boot service:

```bash
N8N_WEBHOOK_URL=https://<your-n8n-instance>.app.n8n.cloud/webhook/flora-campaign
N8N_WEBHOOK_SECRET=flora_n8n_secret_change_in_production
N8N_INTERNAL_SECRET=flora_dev_secret_change_in_production
```

---

## 🛡️ Anti-Spam & Idempotency Safeguards

1. **Explicit Opt-in Enforcement**: Only users with `marketing_consent = true`, `email_verified = true`, and `unsubscribed_at IS NULL` are fetched.
2. **Database Idempotency**: The `campaign_recipients` table enforces `UNIQUE (campaign_id, email)` preventing duplicate sends across workflow retries.
3. **Throttling**: The workflow includes an explicit 1.5-second wait per recipient, respecting Gmail SMTP limits (safely handling 1–50 recipients without spam triggering).
4. **Secure Unsubscribe**: Every email contains an unguessable token-based unsubscribe URL (`/unsubscribe?token=...`), ensuring recipients cannot be unsubscribed by malicious third parties.
5. **Pre-Flight Test Dispatch**: Admins can preview the rendered botanical email and trigger an isolated test send targeting strictly `srushti.h.kale2004@gmail.com` before approving a blast to real subscribers.

# Doc Intel instance setup (ServiceNow)

This document covers **plan step #2 only**: configuring your ServiceNow instance so server-side scripts can call the Azure APIM Document Intelligence invoice endpoint. Complete this before implementing the attachment business rule, mapper, or schema changes from the broader DI integration plan.

## What you are setting up

The integration will read configuration from **system properties** on the instance (not from source code). Scripts will use `GlideProperties` to load:

| Property name | Required | Purpose |
|---------------|----------|---------|
| `x_2058901_demo.docintel.url` | Yes | Full POST URL for the trained invoice PDF endpoint |
| `x_2058901_demo.docintel.subscription_key` | Yes | Azure APIM subscription key (`Ocp-Apim-Subscription-Key` header) |

Optional (add later if you want toggles without redeploy):

| Property name | Default if omitted | Purpose |
|---------------|-------------------|---------|
| `x_2058901_demo.docintel.enabled` | `true` | Set to `false` to disable outbound DI calls in dev/test |
| `x_2058901_demo.docintel.timeout_ms` | `120000` | HTTP timeout for slow/large PDFs |

### Expected endpoint (from your POC)

```
https://tsc-api.azure-api.net/DocIntel/v1/trained/invoice/pdf
```

Request shape (for your own smoke tests):

- **Method:** `POST`
- **Header:** `Ocp-Apim-Subscription-Key: <subscription key>`
- **Header:** `Content-Type: application/pdf`
- **Body:** raw PDF bytes (not the file path string — use `@file` in curl)

---

## Step 1 — Create system properties in ServiceNow

Use an admin account with access to **System Properties** (`sys_properties`).

### Navigation

1. Filter navigator: **System Properties** (or `sys_properties.list`).
2. **New** for each property below.

### Property: API URL

| Field | Value |
|-------|-------|
| **Name** | `x_2058901_demo.docintel.url` |
| **Type** | `string` |
| **Description** | Doc Intel invoice PDF endpoint URL (Azure APIM) |
| **Value** | `https://tsc-api.azure-api.net/DocIntel/v1/trained/invoice/pdf` |

Leave **Ignore cache** unchecked unless you are actively debugging property values and need instant reads (normally cache is fine).

### Property: subscription key

| Field | Value |
|-------|-------|
| **Name** | `x_2058901_demo.docintel.subscription_key` |
| **Type** | `password2` (preferred) or `string` |
| **Description** | Azure APIM subscription key for Doc Intel |
| **Value** | *(paste key from Azure / your team — do not commit to git)* |

**Why `password2`:** masks the value in the UI and avoids casual exposure in property lists. Server scripts still read it via `gs.getProperty()`.

### Optional: enable flag

| Field | Value |
|-------|-------|
| **Name** | `x_2058901_demo.docintel.enabled` |
| **Type** | `true | false` |
| **Value** | `true` |

### Optional: timeout

| Field | Value |
|-------|-------|
| **Name** | `x_2058901_demo.docintel.timeout_ms` |
| **Type** | `integer` |
| **Value** | `120000` |

---

## Step 2 — Scope and visibility

These properties belong to scoped app **`x_2058901_demo`**.

When creating properties from the app scope:

- Ensure **Application** is your scoped app (not global), **or**
- Use global properties with the `x_2058901_demo.` prefix as shown (works well with `GlideProperties.get()` from scoped scripts).

Do **not** store the key in:

- Update sets checked into git
- Client-side React code
- UI pages or transform maps

---

## Step 3 — Network and Azure APIM access

Confirm the ServiceNow instance can reach Azure APIM outbound:

1. **Mid-server / egress:** If your instance uses a mid server for outbound HTTP, ensure that mid can reach `tsc-api.azure-api.net` on HTTPS (443).
2. **Corporate proxy:** If required, configure the instance or mid proxy settings so `RESTMessageV2` calls succeed.
3. **APIM subscription:** Key must be valid for the `DocIntel` API product; expired or wrong product returns `401` / `403`.

If outbound calls fail only from ServiceNow but curl works from your laptop, the issue is almost always mid-server routing, proxy, or allowlisting — not the integration code.

---

## Step 4 — Smoke test from ServiceNow (Background Script)

After properties are saved, run this in **Scripts - Background** (scoped app **Workflow Management Portal** / `x_2058901_demo` if prompted):

```javascript
(function () {
    var url = gs.getProperty('x_2058901_demo.docintel.url');
    var key = gs.getProperty('x_2058901_demo.docintel.subscription_key', '');

    if (!url || !key) {
        gs.error('DocIntel config missing: url=' + url + ' keyPresent=' + (key ? 'yes' : 'no');
        return;
    }

    // Replace with a sys_attachment sys_id for a PDF on a demo ticket, or skip body test and only log config.
    var attachmentId = ''; // e.g. paste sys_id from sys_attachment after submitting a test ticket

    var rm = new sn_ws.RESTMessageV2();
    rm.setEndpoint(url);
    rm.setHttpMethod('POST');
    rm.setRequestHeader('Ocp-Apim-Subscription-Key', key);
    rm.setRequestHeader('Content-Type', 'application/pdf');
    rm.setRequestHeader('Accept', 'application/json');
    rm.setHttpTimeout(120000);

    if (attachmentId) {
        var sa = new GlideSysAttachment();
        var bytes = sa.getBytes(attachmentId);
        if (!bytes) {
            gs.error('No bytes for attachment ' + attachmentId);
            return;
        }
        rm.setRequestBodyFromAttachment(bytes);
        // If setRequestBodyFromAttachment is unavailable on your version, use:
        // rm.setRequestBodyFromStream(new GlideScriptableInputStream(bytes));
    } else {
        gs.info('DocIntel config OK. Set attachmentId to run a full POST test.');
        gs.info('url=' + url);
        return;
    }

    var response = rm.execute();
    var status = response.getStatusCode();
    var body = response.getBody();

    gs.info('DocIntel test status=' + status);
    gs.info('DocIntel test body (first 500 chars)=' + body.substring(0, 500));

    if (status >= 200 && status < 300) {
        gs.info('DocIntel smoke test PASSED');
    } else {
        gs.error('DocIntel smoke test FAILED status=' + status);
    }
})();
```

**How to get `attachmentId`:**

1. Submit a test ticket with a PDF through the portal.
2. Open **Attachments** related list on the ticket, or query `sys_attachment` where `table_name=x_2058901_demo_ticket`.
3. Copy the PDF row `sys_id`.

Success looks like HTTP **200** and JSON containing `"Documents"` (see [`doc-intel-documents-sample.json`](./doc-intel-documents-sample.json)).

---

## Step 5 — Smoke test from your workstation (optional)

Useful to validate the key and PDF before testing from ServiceNow.

**PowerShell / Windows curl** (revocation check workaround):

```powershell
curl.exe --ssl-no-revoke -X POST "https://tsc-api.azure-api.net/DocIntel/v1/trained/invoice/pdf" `
  -H "Ocp-Apim-Subscription-Key: YOUR_KEY_HERE" `
  -H "Content-Type: application/pdf" `
  -H "Accept: application/json" `
  --data-binary "@C:\path\to\invoice.pdf"
```

Important: `@` before the file path sends file **contents**, not the path string.

---

## Step 6 — Checklist before moving to the rest of the plan

- [ ] `x_2058901_demo.docintel.url` created and correct
- [ ] `x_2058901_demo.docintel.subscription_key` created (`password2` recommended)
- [ ] Background script confirms properties readable (and optional full POST returns 200)
- [ ] Outbound HTTPS from instance/mid to `tsc-api.azure-api.net` confirmed
- [ ] Subscription key stored only on instance — not in repo, chat, or client bundle

When this checklist is done, the codebase work can assume:

```javascript
var url = gs.getProperty('x_2058901_demo.docintel.url');
var key = gs.getProperty('x_2058901_demo.docintel.subscription_key');
```

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| `401 Unauthorized` / `403 Forbidden` | Wrong or expired subscription key; wrong APIM product |
| `Uploaded content is not a PDF (missing %PDF- header)` | Body was file path text, not bytes — fix curl `@file` or attachment read in script |
| Timeout from ServiceNow only | Increase timeout property; check mid server; large PDF |
| curl works locally, SN fails | Mid-server egress, proxy, or firewall |
| `CRYPT_E_NO_REVOCATION_CHECK` (local curl only) | Windows Schannel — use `--ssl-no-revoke` or PowerShell `Invoke-RestMethod` |
| Empty `Documents` / parse errors | Wrong endpoint or model; inspect full JSON body |

---

## Related files in this repo

| File | Purpose |
|------|---------|
| [`doc-intel-documents-sample.json`](./doc-intel-documents-sample.json) | Trimmed sample `Documents` array from a successful response |
| [`scripts/extract-doc-intel-documents.py`](../scripts/extract-doc-intel-documents.py) | Re-extract `Documents` from a saved curl response |
| Doc Intel integration plan (`.cursor/plans/`) | Full integration: schema, BR, mapper, client read path |

After instance setup is complete, proceed with plan steps **1, 3, 4, 5** (schema, server scripts, attachment BR, client types).

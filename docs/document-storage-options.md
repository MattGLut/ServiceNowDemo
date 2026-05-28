# Document storage options — pros and cons

For the hybrid ticket intake design, the main choice is **ServiceNow native attachments** vs **Azure Blob Storage** (with a pointer stored on the ticket record). Azure Blob is the object-store equivalent of AWS S3 (Storage Account → container → blob).

---

## Option A: ServiceNow attachments (`sys_attachment` / `sys_attachment_doc`)

Files are uploaded via the Attachment API (`/api/now/attachment/upload`) and stored in the platform attachment model (metadata in `sys_attachment`, file body typically chunked in `sys_attachment_doc` on the instance).

### Pros

- **Simplest intake** — works with the current UI page and Table/Attachment API; no extra cloud plumbing.
- **Same security model** — ACLs, audit, and “attachments on this record” stay in one place.
- **Familiar operations** — admins see attachments on the ticket like any other ServiceNow record.
- **No cross-cloud credentials in the browser** — only the ServiceNow session token and standard APIs.
- **Good for small files, demos, and low volume.**

### Cons

- **Not blob storage** — bytes live in ServiceNow’s attachment model, not as a clean object URL in Azure.
- **Cost at scale** — instance storage is expensive; large PDF volume adds up quickly.
- **Weaker fit for Azure Document Intelligence** — DI expects a blob URL or similar; files often need to be copied or re-exported from ServiceNow.
- **Performance** — large files increase database load and can affect backups and upgrades.
- **Limited lifecycle options** — no native hot/cool/archive tiers without additional archiving products.

**Best when:** Low volume, ITIL-only users, and the priority is the fastest path with minimal integration work.

---

## Option B: Azure Blob Storage (+ metadata on the ticket table)

Upload targets a **container** (e.g. `ticket-documents`). The ticket record stores blob path, container, content type, and related metadata. Azure Document Intelligence reads from the blob URL or via the Azure SDK.

### Pros

- **Strong fit for Azure Document Intelligence** — native input from blob URL or container; no need to reconstruct files from ServiceNow chunks.
- **Cost-effective, scalable object storage** — lifecycle policies (hot → cool → archive), versioning, soft delete.
- **Keeps ServiceNow lean** — ServiceNow holds workflow state and **pointers**, not multi-megabyte binaries.
- **Aligns with hybrid architecture** — STP and DI downstream systems can use a consistent blob contract.
- **Direct browser upload** — presigned/SAS upload can send files straight to Azure, avoiding ServiceNow size and timeout limits.

### Cons

- **More moving parts** — Storage Account, container, IAM, SAS/presigned upload flow, and error handling.
- **Security must be designed** — SAS expiry, least privilege, encryption, and network rules (e.g. private endpoints).
- **Not the default ServiceNow attachment UI** — unless you build links, a viewer, or sync attachments back into ServiceNow.
- **Two systems of record** — ticket metadata vs blob existence must stay in sync (failed uploads, retries, idempotency).
- **Extra server-side work** — typically Scripted REST, Flow, or an external API to issue upload URLs; the React UI alone is not sufficient.

**Best when:** Document intelligence, large PDFs/images, external pickup systems, and the platform strategy is Azure-centric.

---

## Practical recommendation

| Path | Suggested storage |
|------|-------------------|
| **STP** (straight-through, minimal documents) | ServiceNow attachments *or* small blobs — either can work. |
| **DI** (OCR, auto-fill, human review) | **Azure Blob** + fields on the ticket; Document Intelligence reads the blob directly. |
| **Pickup export** | Export **blob URI + ticket fields**, not ServiceNow attachment chunks. |

A common pattern: **metadata and status in ServiceNow**, **documents in Azure Blob**, with ServiceNow attachments used only when files must appear on the standard ServiceNow form.

---

## Decision shorthand

- Choose **ServiceNow attachments** if the priority is **minimum engineering** and **low file volume**.
- Choose **Azure Blob** if **Azure Document Intelligence**, **file size**, **cost**, and **external consumers** are primary drivers — which matches the intended hybrid direction.

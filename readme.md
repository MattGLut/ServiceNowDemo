# Ticket Intake Portal

ServiceNow scoped application (`x_2058901_demo`) with a **React + TypeScript** UI page for hybrid ticket processing: straight-through (STP) automation and Azure Document Intelligence extraction with human review.

See [docs/architecture.md](docs/architecture.md) for the full system design.

**Current capability:** Portal home, ticket submission (`x_2058901_demo_ticket`), admin-managed workflow types (`x_2058901_demo_workflow_type`), and immersive ticket detail view with attachment downloads.

## Build and deploy

```bash
npm install
npm run build
npm run deploy
```

Styling uses [Tailwind CSS v4](https://tailwindcss.com). `npm run build` compiles `src/client/tailwind.css` into `tailwind.generated.css`, then inlines that CSS into the JS bundle (required for ServiceNow UI pages).

For local UI work with hot reload on styles, run `npm run dev:css` in a second terminal alongside `npm run dev`.

## UI page endpoints

| Endpoint | Purpose |
|----------|---------|
| `x_2058901_demo_incident_manager.do` | **Home** — portal landing |
| `x_2058901_demo_ticket_submit.do` | **Submit** — ticket intake form |
| `x_2058901_demo_ticket_list.do` | **My tickets** — full-page submitted ticket list |
| `x_2058901_demo_ticket_view.do?sys_id={sys_id}` | **Detail** — full-page ticket view with attachment download links |

## Instance cleanup after reset

Removing Fluent source from this repo **does not automatically delete** metadata already deployed to your instance. After deploying the cleaned app:

1. Verify old demo tables `x_2058901_demo_incident_response` and `x_2058901_demo_incident_complaint` are unused.
2. Retire or delete them in Application Manager / Table administration if safe.
3. Confirm the home page loads and the submit page shows the intake form.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile CSS + SDK build |
| `npm run deploy` | Install to configured instance |
| `npm run lint` | ESLint on `src/` |
| `npm run dev` | SDK dev server |
| `npm run dev:css` | Watch Tailwind |

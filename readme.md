# Ticket Intake Portal

ServiceNow scoped application (`x_2058901_demo`) with a **React + TypeScript** UI page for hybrid ticket processing: straight-through (STP) automation and Azure Document Intelligence extraction with human review.

See [docs/architecture.md](docs/architecture.md) for the full system design.

**Current capability:** Submit tickets (`x_2058901_demo_ticket`) with title, description, and optional file attachments via the intake form on the UI page.

## Build and deploy

```bash
npm install
npm run build
npm run deploy
```

Styling uses [Tailwind CSS v4](https://tailwindcss.com). `npm run build` compiles `src/client/tailwind.css` into `tailwind.generated.css`, then inlines that CSS into the JS bundle (required for ServiceNow UI pages).

For local UI work with hot reload on styles, run `npm run dev:css` in a second terminal alongside `npm run dev`.

## UI page endpoint

`x_2058901_demo_incident_manager.do` (unchanged to preserve existing bookmarks and CI)

## Instance cleanup after reset

Removing Fluent source from this repo **does not automatically delete** metadata already deployed to your instance. After deploying the cleaned app:

1. Verify old demo tables `x_2058901_demo_incident_response` and `x_2058901_demo_incident_complaint` are unused.
2. Retire or delete them in Application Manager / Table administration if safe.
3. Confirm the UI page loads and shows the placeholder shell.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | Compile CSS + SDK build |
| `npm run deploy` | Install to configured instance |
| `npm run lint` | ESLint on `src/` |
| `npm run dev` | SDK dev server |
| `npm run dev:css` | Watch Tailwind |

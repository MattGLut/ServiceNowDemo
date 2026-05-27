To deploy

```
npm install
npm run build
npm run deploy
```

Styling uses [Tailwind CSS v4](https://tailwindcss.com). `npm run build` compiles `src/client/tailwind.css` into `tailwind.generated.css` before the ServiceNow SDK build.

For local UI work with hot reload on styles, run `npm run dev:css` in a second terminal alongside `npm run dev`.

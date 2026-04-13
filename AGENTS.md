<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:theme-reference-rules -->
# Theme Reference (Light, Nature-Forward)

Use semantic CSS tokens in `app/globals.css` as the source of truth for styling.

- Keep `tailwind.cssVariables` set to `true` in `components.json`.
- Prefer semantic utilities in components: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`, `ring-ring`.
- Keep the default experience relatively light, with earthy green and warm neutral accents.
- Adjust only token values in `:root` / `.dark` whenever possible instead of hardcoded utility colors.
- Use `--radius` as the base token and keep derived radius tokens in `@theme inline`.
- For new design tokens, define both light and dark values and expose them in `@theme inline`.

Current palette direction:

- Primary (forest): `#3B6D11`-adjacent in OKLCH.
- Secondary/muted: warm neutral leaf/sand tones.
- Background/card: bright, readable, and low-contrast textured where helpful.
<!-- END:theme-reference-rules -->

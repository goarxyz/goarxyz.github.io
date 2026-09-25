# goarxyz.github.io

A personal, mobile-first entertainment hub deployed as a static site on GitHub Pages.
It presents a single dark-themed front end that links out to embedded movie/TV,
music, and browser-game experiences.

## Sections

- **Home gate** (`index.html`) — a landing screen with tiles and a bottom dock that
  route to each section via hash links.
- **Movies & TV** (`goarxyz.html`) — a catalog UI that looks up titles and plays them
  through a selectable list of third-party video embed providers (configured in
  `embeds.js`). HLS playback is supported via `hls.js`.
- **Music** (`music.html`) — a music browsing/playback page.
- **Games** (`games/index.html`) — an instant HTML5 games library you can browse by
  collection and play in one tap.

## Tech

- Plain HTML, CSS, and JavaScript — no build step.
- Client libraries loaded from a CDN (`libcurl.js`, `hls.js`).
- Web-app metadata (manifest, theme color, apple-touch icons) for install-to-home-screen.

## Running locally

Because it is fully static, serve the repository root with any static file server:

```bash
python3 -m http.server 8080
# then open http://127.0.0.1:8080/
```

## Deployment

Deployment is automated with GitHub Pages. The workflow in
`.github/workflows/static.yml` publishes the entire repository on every push to
`main` (and can be triggered manually from the Actions tab).

Live site: https://goarxyz.github.io/

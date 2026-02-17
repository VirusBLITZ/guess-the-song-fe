<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">🎶 Guess The Song - Frontend</h3>

  <p align="center">
    The frontend for Guess The Song, it connects to a <a href="https://github.com/VirusBLITZ/guess_the_song_backend">GTS backend</a> instance
    <br />
    <br />
    <a href="https://gts.bltz.cloud">View Demo</a>
    ·
    <a href="https://github.com/VirusBLITZ/guess-the-song-fe/issues">Report Bug</a>
    ·
    <a href="https://github.com/VirusBLITZ/guess-the-song-fe/issues">Request Feature</a>
  </p>
</div>

# Dev Setup

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npx nuxi@latest generate

# pnpm
pnpm dlx nuxi generate

# bun
bunx run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker

Build the container image:

```bash
docker build -t guess-the-song-fe:latest .
```

Run the container:

```bash
docker run -d --name guess-the-song-fe -p 8081:8081 guess-the-song-fe:latest
```

The app will be available at `http://localhost:8081`.

To stop and remove it:

```bash
docker stop guess-the-song-fe
docker rm guess-the-song-fe
```

To view logs:

```bash
docker logs -f guess-the-song-fe
```

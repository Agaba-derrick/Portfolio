# My Portfolio

> CI: Every pull request to `main`/`Develop` runs formatting, lint, and build checks via GitHub Actions. Unformatted code fails the CI.

This is my personal portfolio site, built with Next.js and deployed on GitHub Pages.

## Live Site

Your portfolio is live at: [https://agaba-derrick.github.io/Portfolio/](https://agaba-derrick.github.io/Portfolio/)

_Last deployed by @Agaba-derrick 4 minutes ago_

## Build & Deployment

- The project is built using [Next.js](https://nextjs.org/).
- GitHub Actions handles the build and deployment automatically whenever changes are pushed to the `Develop` branch.
- The static site is generated using `next export` and hosted on GitHub Pages.

### Scripts

- `npm run build` – Builds the project for production.
- `npm run export` – Exports the static site to the `out/` folder.
- `npm run dev` – Runs the project in development mode.

## Notes

- Make sure all changes are committed and pushed to the `Develop` branch to trigger deployment.
- The deployed site is served from the `out/` folder via GitHub Pages.

# Hermes hackathon showcase — asset pack

This repository is an asset pack for a showcase website of Kyle Durepos’s ten entries in the Nous Research Hermes Agent Plugin Hackathon (deadline 11 November 2026, 5 PM America/Toronto). It is not the site itself.

Build a public marketing site from `assets/` only. Give the index and each entry page a completely different visual style. Make every entry page rich: short intro, real stats, feature list, 4–6 use cases, screenshots, the submission video when present, and install steps. Do not invent stats, quotes, screenshots, or videos. If `facts.json` says a figure is unknown or a video is missing, say so or omit it.

Always call the music plugin **poptart** (catalog id `hermes-strudel-studio`, catalog title “Hermes Strudel Studio”). Do not brand the site as a Nous Research product; these are community plugins by Kyle Durepos / mojomast.

Do not enable GitHub Pages or deploy from this pack unless a later brief says so.

## Entries

| Slug | Name | Repo | Catalog PR | X post |
|---|---|---|---|---|
| `eoh` | Eye Of Hermes (EOH) | [mojomast/EOH](https://github.com/mojomast/EOH) | [#149691](https://github.com/NousResearch/hermes-agent/pull/149691) | [post](https://x.com/ussyverse/status/2118845028910915846) |
| `hermagotchi` | Hermagotchi | [mojomast/hermagotchi](https://github.com/mojomast/hermagotchi) | [#150358](https://github.com/NousResearch/hermes-agent/pull/150358) | [post](https://x.com/ussyverse/status/2118850720669859883) |
| `poptart` | poptart | [mojomast/poptart](https://github.com/mojomast/poptart) | [#150357](https://github.com/NousResearch/hermes-agent/pull/150357) | [post](https://x.com/ussyverse/status/2118847400152572123) |
| `hyperrizz` | hyperrizz | [mojomast/hyperrizz](https://github.com/mojomast/hyperrizz) | [#151945](https://github.com/NousResearch/hermes-agent/pull/151945) | [post](https://x.com/ussyverse/status/2119790524097765383) |
| `stitchslop` | stitchslop | [mojomast/hermes-stitchslop](https://github.com/mojomast/hermes-stitchslop) | [#151946](https://github.com/NousResearch/hermes-agent/pull/151946) | [post](https://x.com/ussyverse/status/2119790420704239898) |
| `hermes-plugin-dev` | Hermes Plugin Dev | [mojomast/hermes-plugin-dev](https://github.com/mojomast/hermes-plugin-dev) | [#152699](https://github.com/NousResearch/hermes-agent/pull/152699) | [post](https://x.com/ussyverse/status/2120181358073184269) |
| `assetrizz` | assetrizz | [mojomast/assetrizz-hermes](https://github.com/mojomast/assetrizz-hermes) (+ [assetrizz](https://github.com/mojomast/assetrizz) library) | [#152771](https://github.com/NousResearch/hermes-agent/pull/152771) | [post](https://x.com/ussyverse/status/2120191163764449283) |
| `photo-to-part` | photo-to-part | [mojomast/hermes-photo-to-part](https://github.com/mojomast/hermes-photo-to-part) | [#153757](https://github.com/NousResearch/hermes-agent/pull/153757) | [post](https://x.com/ussyverse/status/2120597848089882860) |
| `templeos` | TempleOS for Hermes | [mojomast/hermes-templeos](https://github.com/mojomast/hermes-templeos) (+ [Temple of Hermes](https://github.com/mojomast/temple-of-hermes) guest) | [#153852](https://github.com/NousResearch/hermes-agent/pull/153852) | [post](https://x.com/ussyverse/status/2120605050871455858) |
| `bundlebees` | bundlebees | [mojomast/bundlebees](https://github.com/mojomast/bundlebees) | [#153888](https://github.com/NousResearch/hermes-agent/pull/153888) | [post](https://x.com/ussyverse/status/2120622521418686752) |

## Layout

Each entry lives in `assets/<slug>/`:

- `facts.json` — name, tagline, repos, release tag and SHA, X post, catalog PR, stats taken only from that plugin’s README or GitHub release, features, use cases, install, and video status
- `source.md` — the plugin README at the catalog pin (some entries also have `source-integration.md`, `source-library.md`, or `source-guest.md`)
- `img/` — real banners, screenshots, and docs images from the plugin repo (and a few delivery stills)
- `video.mp4` + `poster.jpg` — H.264 720p, faststart, under 14 MB, when a submission video was found

Pinned catalog YAML copies are in `assets/_catalog/` for reference.

## Videos that are missing

These three have no `video.mp4`. Do not download videos from X or invent a replacement:

- `hyperrizz` — no submission MP4 found; example stills from the in-repo broadcast lab are in `img/`
- `stitchslop` — no submission MP4 found
- `hermes-plugin-dev` — no submission MP4 found (banner only)

## Licensing

READMEs, screenshots, and videos remain under their upstream project licenses (see each repo). This pack does not relicense them. Metadata in `BRIEF.md` and `facts.json` is provided so the site can be built; keep attribution and links back to the source repos, releases, catalog PRs, and X posts.

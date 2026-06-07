# cjhuang.com — personal academic site

Personal academic homepage of **Ronald Chih-Jung Huang, M.D.** — plastic & reconstructive surgeon, burn intensivist, and AI researcher at Chang Gung Memorial Hospital.

Built on the [al-folio](https://github.com/alshedivat/al-folio) Jekyll theme (v0.16.3, stable line).

## Architecture

- **cjhuang.com** — this repo (personal site)
- **lab.cjhuang.com** — [CJRonald/VDILab](https://github.com/CJRonald/VDILab) (VDI Lab site), linked from the navbar

Deployed via GitHub Pages + Cloudflare DNS/SSL. Custom domain set in `CNAME`.

## Local preview

```bash
bundle install
bundle exec jekyll serve   # → http://localhost:4000
```

Requires Ruby 3.x (system Ruby 2.6 on macOS is too old — use Homebrew Ruby or rbenv).

## Editing content

| What | Where |
|------|-------|
| Bio / homepage | `_pages/about.md` |
| Publications | `_bibliography/papers.bib` (`selected={true}` → shows on homepage) |
| Research areas + AI demos | `_pages/projects.md` (permalink `/research/`) |
| CV | `_data/cv.yml` + `assets/pdf/cv.pdf` |
| News timeline | `_news/*.md` |
| Social links | `_data/socials.yml` (add Scholar ID + ORCID to enable badges) |
| Site config | `_config.yml` |

## TODO

- [ ] Add Google Scholar author ID + ORCID to `_data/socials.yml` (enables citation badges)
- [ ] Drop CV PDF into `assets/pdf/cv.pdf`

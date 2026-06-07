# cjhuang-site — Claude Memory

**Ronald Chih-Jung Huang 個人學術網站** — [cjhuang.com](https://cjhuang.com)（自 2026-06-07 上線）

歸 `Homepage/`（web agent）統籌，與燒傷中心官網、VDILab、ResearchTools 並列為對外公開資產。

## 技術棧

- **al-folio v0.16.3**（穩定線；**非** v1 pluginized 新架構 — 依賴複雜、本機 Ruby 2.6 跨不動）Jekyll 主題，學術極簡單欄風，對齊 yunyuntsai/yingjialin 風格
- repo `CJRonald/cjhuang-website`，**GitHub Actions（`deploy.yml`）build → `gh-pages` 分支**
- Cloudflare DNS：apex `cjhuang.com` → GitHub Pages 4 個 A record（185.199.108-111.153），Proxied，SSL **Full**
- 深藍主題 `#2c5aa0`（`_sass/_variables.scss` 的 `$purple-color`，對齊燒傷中心官網）

## 導覽列

about · publications · research · cases · teaching · cv · blog · **lab↗**（外連 lab.cjhuang.com）
+ 右側 **Google Scholar icon**（academicons `ai-google-scholar`，`scholar_userid` 在 `_config.yml`）

## 內容編輯對照

| 內容 | 檔案 |
|------|------|
| bio / 首頁 | `_pages/about.md`（含 about 頁底 Contact email 區塊）|
| 論文 | `_bibliography/papers.bib`（`selected={true}` → 上首頁）|
| research + AI demo | `_pages/projects.md`（permalink `/research/`）|
| cases 臨床案例 | `_projects/case_*.md`（before/after slider，front matter `images: {compare,slider}`）|
| teaching | `_pages/teaching.md`（素材取自 Medical_Career，單向，非反向 SSOT）|
| CV | `_data/cv.yml`（**不是** resume.json — 見下方坑）|
| news timeline | `_news/*.md` |
| blog | `_posts/*.md`（blog_name="Notes"，tag/category 導覽開）|

## 聯絡 / 帳號

- email：`contact@cjhuang.com`（**Cloudflare Email Routing → isly29@gmail.com，已驗證可收**）；顯示於 about 頁底 Contact 區塊
- Google Scholar：author ID `o5hHtnQAAAAJ`（header icon；引用數 badge 未啟用）

## 命名 / 架構決策（路線 C）

個人品牌為主、「VDI Lab @ CGMH Burn Center」當 lab 暱稱；個人站 + lab 子網域；lab 成熟後再升級獨立網域（改 DNS，內容不搬）。詳見 [memory/decisions.md](../../../.claude/projects/-Users-ronald-Desktop-RonaldHomeLab/memory/decisions.md)。

## 本機開發

```bash
PATH=/opt/homebrew/opt/ruby/bin:$PATH   # 系統 Ruby 2.6 太舊，必須用 Homebrew Ruby 4.x
bundle exec jekyll serve --port 4001    # localhost 預覽
bundle exec jekyll build                # 產出 _site/
```

## ⚠️ al-folio demo 殘留坑（建站後才發現，已修）

1. **CV 頁顯示 Einstein**：al-folio `jekyll_get_json` 預設 import `assets/json/resume.json`（Einstein JSON Resume）→ 蓋掉 `_data/cv.yml`。已**註解掉 `_config.yml` 的 `jekyll_get_json` 區塊**讓 cv layout fall back 到 cv.yml。
2. **jekyll-scholar 作者高亮**：`scholar.last_name/first_name` 預設 Einstein/Albert → 已改 **Huang**（決定 publications 頁哪個作者名加粗）。
3. **profiles.liquid include 已刪檔**：刪 demo 頁後 `profiles.liquid` 仍 include `about_einstein.md` → 連帶刪 profiles/blog/books/teaching/repos/dropdown demo 頁。
4. **imagemagick `convert` not found 破圖** → 關 `imagemagick.enabled`（無此依賴，單張 profile 照直出）。
5. **footer 重複 copyright** → footer.liquid 改成只用 `footer_text`。
6. 移除 al-folio 開發用 workflows（codeql/lighthouse/prettier 等），只留 `deploy.yml`。

## 待補

- ORCID（`_data/socials.yml`）
- CV PDF (`assets/pdf/cv.pdf`)（有 `Medical_Career/cv/CJHuang_CV_2026-05.pdf` 待放，但含個資需確認）
- 真臨床案例照（目前 cases 是 1 張 placeholder）
- blog 真文校稿（"From benchmark to bedside" 為草稿）
- lab.cjhuang.com 站內容升級（接 ResearchTools demos / 補 publications）

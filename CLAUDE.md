# cjhuang-site — Claude Memory

**Ronald Chih-Jung Huang 個人學術網站** — [cjhuang.com](https://cjhuang.com)（自 2026-06-07 上線）

歸 `Homepage/`（web agent）統籌，與燒傷中心官網、VDILab、ResearchTools 並列為對外公開資產。

## 技術棧

- **al-folio v0.16.3**（穩定線；**非** v1 pluginized 新架構 — 依賴複雜、本機 Ruby 2.6 跨不動）Jekyll 主題，學術極簡單欄風，對齊 yunyuntsai/yingjialin 風格
- repo `CJRonald/cjhuang-website`，**GitHub Actions（`deploy.yml`）build → `gh-pages` 分支**
- Cloudflare DNS：apex `cjhuang.com` → GitHub Pages 4 個 A record（185.199.108-111.153），Proxied，SSL **Full**
- 深藍主題 `#2c5aa0`（`_sass/_variables.scss` 的 `$purple-color`，對齊燒傷中心官網）

## 導覽列

文字 nav：**about · research · services · activities**
右側 icon：**Google Scholar**（academicons `ai-google-scholar`，`scholar_userid`）+ **LinkedIn**（Tabler `ti-brand-linkedin`，`linkedin_username` 在 `_config.yml`）+ search + 主題切換

- **CV → LinkedIn icon**（不放攤開的 CV 網頁 — user 嫌裸露+跟 LinkedIn 重複；`_data/cv.yml` 留備份不顯示，`_pages/cv.md` 已刪）
- **lab 移出 nav**（lab.cjhuang.com 站仍在，about 頁內文有連結）
- **cases / blog 移出 nav**，從 services 頁底連入（`/cases/` `/blog/` 頁面仍在）
- **publications 移出 nav**（頁面 `/publications/` 保留學術引用 URL），嵌進 research 頁底（selected papers）+ 「See all publications →」連入
- **頁面大標 vs nav 標籤可分離**：`page.liquid` 支援 `display_title` override（如 services 的 nav 顯示 "services"、頁面大標 "Clinical Services"）

## 內容編輯對照

| 內容 | 檔案 |
|------|------|
| bio / 首頁 | `_pages/about.md`（bio + news + about 頁底 Contact email；`selected_papers: false`=論文不在首頁，在 research 頁）|
| 論文 | `_bibliography/papers.bib`（`selected={true}` → research 頁底顯示）|
| research | `_pages/projects.md`（`/research/`，`display_title: Academic Research`）：**Clinical Research / AI & Computational 兩大類** + AI demo + 嵌 selected publications |
| **services（臨床服務概述）** | `_pages/services.md`（`/services/`，`display_title: Clinical Services`）：引言 + **Where I Practice**（林口 CGMH + 土城兩院連官網；掛號句直連長庚醫師頁 `DoctorInfo/1666`；土城子網域已失效用 `cgmh.org.tw/tch`、科別為 **Department** of Plastic Surgery）+ 嵌 **clinic-hours.png**（門診時刻表，`figure.liquid` class `img-fluid rounded` **無 z-depth 陰影**）+ 分隔線 + **Specialties**（h2 主標 + 4 張 card：Rhinoplasty & Nasal Reconstruction / Burn & Wound Care / Aesthetic Surgery / Reconstructive Microsurgery）+ 分隔線 + **Experience**（現職 + residency；土城用正式名 **New Taipei Municipal TuCheng Hospital**）+ 頁底連 cases/blog。⚠️ **card grid 用 `row-cols-1 row-cols-md-2` + `.col`**（抄 cases/blog 頁；al-folio 此版 `col-md-6` 自製寫法線上不並排）。⚠️ 連結內粗體要顯示連結色靠 `_base.scss` 的 `a strong/a em { color: inherit }` |
| activities | `_pages/teaching.md`（`/activities/`）：引言段 + **三群 `---` 分隔**（hr margin 2rem，CSS `.post article hr`）：① **Board Certifications**（4 張篩檢版段落式，砍 General Surgery）+ **Professional Societies**（6 學會 · 分隔）② International/Domestic Conference + Oversea Exchange ③ Service（審稿期刊不列論文題目）。**全機構名加官網超連結**（6 學會 + ABA/PRS Korea KSPRS/NYU Wyss/SGH/Juntendo 英文站，`{:target="_blank"}` 開新分頁）。素材取自 Medical_Career 單向。⚠️ **國內 conference 仍只 2 筆**（Medical_Career 從未建檔，詳見 presentation_list.md 缺口註）|
| cases 臨床案例 | `_projects/case_*.md`（before/after slider；目前 placeholder）|
| 衛教文 | `_posts/*.md` category `patient-education`（中文，整合進 blog）|
| news timeline | `_news/*.md`（升等 / SEGDG ASJ / Triangular Fossa PRS / ABA 2026 poster）。論文 news 加 DOI 連結：ASJ 連 `10.1093/asj/sjag079`、ABA 連 ameriburn.org。⚠️ **PRS Triangular Fossa 連結待補**（DOI 未指派，不湊假連結）|
| blog | `_posts/*.md`（blog_name="Notes"）。⚠️ post 日期勿設未來時間，否則 Jekyll 跳過不 build |
| **機構 logo 牆**（about 頁底）| `_data/affiliations.yml`（每筆 name/logo/url/**height**）+ logo 檔放 `assets/img/logos/`（`cgmh.png` 24px + `nycu.png` 52px 實際使用；`cgmh-logo.svg` 向量原檔備用，未引用）。灰階+hover 變色。⚠️ **各 logo 長寬比不同→用 `height` 欄個別微調**。logo 進 public repo=永久公開，但機構商標屬事實性隸屬展示風險低。⚠️ 不從官網拓 logo，由 user 提供（media kit/名片）|

## 聯絡 / 帳號

- email：`contact@cjhuang.com`（**Cloudflare Email Routing → isly29@gmail.com，已驗證可收**）；顯示於 about 頁底 Contact 區塊
- Google Scholar：author ID `o5hHtnQAAAAJ`（header icon；引用數 badge 未啟用）
- ORCID：`0009-0006-8111-5329`（6/12 加入 `_data/socials.yml`，不上 header icon）
- **schema.org JSON-LD 已啟用**（6/12）：`serve_schema_org: true` → 每頁 head 輸出 Person + sameAs（Scholar/LinkedIn/ORCID）。⚠️ 坑：YAML `>` 折疊字串尾帶 newline 會讓 JSON-LD invalid，`metadata.liquid` description/headline 已改 `jsonify` 處理

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

## 樣式備註

- footer **白底**（`_themes.scss` light mode `--global-footer-bg-color` 改 white）
- blog post 內文加閱讀間距（`main.scss` `.post-content` p line-height 1.85 + margin）
- **繁中文章 CSS 補丁（6/13）**：al-folio 原生只載 Latin 字型（Roboto）+ Latin 行高 + 真斜體，中文文章閱讀體驗差。補丁 4 處，全 scope 在 `:lang(zh-Hant)`，英文頁零影響：
  1. `_layouts/default.liquid`：`<html lang>` 由寫死 `site.lang` 改 `{{ page.lang | default: site.lang }}` → 文章 front matter 的 `lang: zh-Hant` 才真正輸出（同利 SEO/a11y）。**寫中文衛教文必加 `lang: zh-Hant`**，補丁才命中
  2. `main.scss` `:lang(zh-Hant)`：CJK 字型 stack（Roboto 拉丁字優先 + Noto Sans TC + PingFang/JhengHei fallback）、行高 2.0、**`em`/`i` 改正體 600 字重**（中文無真斜體，瀏覽器假斜很醜）、標題行高/字距微調
  3. `_config.yml` google_fonts 加 `fonts_cjk`（Noto Sans TC URL）
  4. `_includes/head.liquid`：條件注入 `fonts_cjk` link

## 待補

- PRS Triangular Fossa news 連結（等正式 DOI 指派後補進 `_news/announcement_1.md`）
- 真臨床案例照（cases 目前是 placeholder；放 public repo = 永久公開，需同意書涵蓋網路公開永久 + 去識別）
- 眼袋衛教文解剖示意圖（`eye-bags.png` 待確認版權來源）
- blog 真文校稿（"From benchmark to bedside" 為草稿）
- lab.cjhuang.com 站內容升級（接 ResearchTools demos / 補 publications）

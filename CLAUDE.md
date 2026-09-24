# cjhuang-site — Claude Memory

**Ronald Chih-Jung Huang 個人學術網站** — [cjhuang.com](https://cjhuang.com)（自 2026-06-07 上線）

歸 `Homepage/`（web agent）統籌，與燒傷中心官網、VDILab、ResearchTools 並列為對外公開資產。

## 技術棧

- **al-folio v0.16.3**（穩定線；**非** v1 pluginized 新架構 — 依賴複雜、本機 Ruby 2.6 跨不動）Jekyll 主題，學術極簡單欄風，對齊 yunyuntsai/yingjialin 風格
- repo `CJRonald/cjhuang-website`，**GitHub Actions（`deploy.yml`）build → `gh-pages` 分支**
- Cloudflare DNS：apex `cjhuang.com` → GitHub Pages 4 個 A record（185.199.108-111.153），Proxied，SSL **Full**
- 深藍主題 `#2c5aa0`（`_sass/_variables.scss` 的 `$purple-color`，對齊燒傷中心官網）
- **Favicon = VDI 六角 logo**（6/20，與 lab.cjhuang.com 統一）：al-folio 原用 emoji（`_config.yml` `icon: 🔬`）→ 改 `icon: favicon.ico`，並把 `_includes/head.liquid` 的 `elsif site.icon != blank` 分支擴成多尺寸（SVG 主 + 16/32 png + ico + apple-touch-icon）。favicon 5 檔在 `assets/img/`（SSOT 在 [VDILab/brand/](../VDILab/brand/)，此為複製副本）。⚠️ 改 favicon 改 brand source 再重生複製，勿單獨改這邊

## 導覽列

文字 nav：**about · research · services · activities**
右側 icon：**Google Scholar**（academicons `ai-google-scholar`，`scholar_userid`）+ **LinkedIn**（Tabler `ti-brand-linkedin`，`linkedin_username` 在 `_config.yml`）+ search + 主題切換

- **CV → LinkedIn icon**（不放攤開的 CV 網頁 — user 嫌裸露+跟 LinkedIn 重複；`_data/cv.yml` 留備份不顯示，`_pages/cv.md` 已刪）
- **lab 移出 nav**（lab.cjhuang.com 站仍在，about 頁內文有連結）
- **blog 移出 nav**，從 services 頁底 + about portal 連入；**cases 整頁已下架**（7/11 `published: false` ×2 檔 + services 連結移除 — placeholder 假案例曾雙入口可達；真實案例 ready 再還原）
- **publications 移出 nav**（頁面 `/publications/` 保留學術引用 URL），嵌進 research 頁底（selected papers）+ 「See all publications →」連入
- **頁面大標 vs nav 標籤可分離**：`page.liquid` 支援 `display_title` override（如 services 的 nav 顯示 "services"、頁面大標 "Clinical Services"）

## 內容編輯對照

| 內容 | 檔案 |
|------|------|
| bio / 首頁 | `_pages/about.md`（bio + news + about 頁底 Contact email；`selected_papers: false`=論文不在首頁，在 research 頁）。**病患衛教入口（6/13）**：`_layouts/about.liquid` 在 contact 區塊前加純繁中 portal 段（「給病友的話」+ 連 **`/blog/category/patient-education/`** 病患衛教分類頁，非 `/blog/` 全文 hub），導引台灣患者進中文衛教分類頁（blog 不在 nav）。⚠️ 此段在 **layout** 非 about.md 內文（about.liquid 渲染序 = 內文→news→**portal**→contact，要真正貼 contact 前只能放 layout）；用 `<div lang="zh-Hant">` 包裹讓 `:lang` 補丁套中文字型 |
| 論文 | `_bibliography/papers.bib`（`selected={true}` → research 頁底顯示）|
| research | `_pages/projects.md`（`/research/`，`display_title: Academic Research`）：**Clinical Research / AI & Computational 兩大類** + AI demo + 嵌 selected publications |
| **services（臨床服務概述）** | `_pages/services.md`（`/services/`，`display_title: Clinical Services`）：引言 + **Where I Practice**（林口 CGMH + 土城兩院連官網；掛號句直連長庚醫師頁 `DoctorInfo/1666`；土城子網域已失效用 `cgmh.org.tw/tch`、科別為 **Department** of Plastic Surgery）+ 嵌 **clinic-hours.png**（門診時刻表，`figure.liquid` class `img-fluid rounded` **無 z-depth 陰影**）+ 分隔線 + **Specialties**（h2 主標 + 4 張 card：Rhinoplasty & Nasal Reconstruction / Burn & Wound Care / Aesthetic Surgery / Reconstructive Microsurgery）+ 分隔線 + **Experience**（現職 + residency；土城用正式名 **New Taipei Municipal TuCheng Hospital**）+ 頁底連 blog（cases 連結 7/11 已隨下架移除）。⚠️ **card grid 用 `row-cols-1 row-cols-md-2` + `.col`**（抄 cases/blog 頁；al-folio 此版 `col-md-6` 自製寫法線上不並排）。⚠️ 連結內粗體要顯示連結色靠 `_base.scss` 的 `a strong/a em { color: inherit }` |
| activities | `_pages/teaching.md`（`/activities/`）：引言段 + **四群 `---` 分隔**（hr margin 2rem，CSS `.post article hr`）。🔴 **區塊順序 user 指定，勿自行調整**：① **Board Certifications**（4 張篩檢版段落式，砍 General Surgery）+ **Professional Societies**（6 學會 · 分隔）② **Oversea Exchange** + **International Conference** + **Domestic Conference** ③ **Awards** ④ Service（審稿期刊不列論文題目）。**Awards 只列 TSAPS 一筆** —— vault `Career/Curriculum Vitae.md` 明載 PRS Global Open Best Burns Paper **非個人獎項**（代表他人出席受獎），不得列入。**全機構名加官網超連結**（6 學會 + ABA/PRS Korea KSPRS/NYU Wyss/SGH/Juntendo 英文站，`{:target="_blank"}` 開新分頁）。素材取自 Medical_Career 單向。⚠️ **國內 conference 仍只 2 筆**（Medical_Career 從未建檔，詳見 presentation_list.md 缺口註）|
| cases 臨床案例 | `_projects/case_*.md`（before/after slider）— **7/11 起 unpublished**：`_pages/cases.md` + `case_01_rhinoplasty.md` 皆 `published: false`（placeholder 勿曝光；連 `/projects/case_01_rhinoplasty/` 詳細頁也會生成，兩處都要關）|
| 衛教文 | 🔴 **正文 canonical ＝ vault `RonaldWiki/Patient Education/cjhuang.com/`**，`_posts/` 為派生 —— 改文字先改 vault 再複製過來；本 repo 只管 Jekyll frontmatter／tag／圖片／部署。`_posts/*.md` category `patient-education`（中文衛教，必加 front matter `lang: zh-Hant`）。現有 4 篇：眼袋（tag `lower-blepharoplasty`）、鼻整形（tag `rhinoplasty`）、**脂肪移植（tag `fat-grafting`，核心論點=脂肪是年輕化「輔助」非主力療法）**、**眼袋術後恢復（沿用 `lower-blepharoplasty` tag，與眼袋文同 tag 故 tag 頁聚在一起，免動 `_config.yml`／`archive.liquid`）**。⚠️ **tag 勿含空格**（jekyll-archives 會拆成兩個壞掉的 archive）→ 用 slug 式 tag id，需在 `_config.yml` `display_tags` 加 + `archive.liquid` 加 display mapping（現有 `lower-blepharoplasty`→"Lower Blepharoplasty" / `rhinoplasty`→"Rhinoplasty" / `fat-grafting`→"Fat Grafting" / category `patient-education`→「病患衛教」）。眼袋文與脂肪文互 link。⚠️ **衛教文 = 概念/期待管理**；**不寫 CC 數/麻醉等操作細節**。🔴 **術後照護界線已修訂**：可寫**恢復時間軸與一般照護原則**（冷敷天數、傷口可否碰水、活動限制），但**不列藥名與劑量**，且須明文導回個別醫囑 —— 理由是病人術後最需要的是期待管理，而具體用藥換藥屬個別處方。⚠️ **一般原則須與 user 實際醫囑核對再寫**：教科書通則會與實務衝突（實例：通則寫「48-72hr 後改溫敷」，user 實際做法是**冷敷 7-10 天、之後不冰不溫**；照通則寫會讓病人偏離醫囑）|
| news timeline | `_news/*.md`（升等 / SEGDG ASJ / Triangular Fossa PRS / ABA 2026 poster / **TSAPS 優秀論文獎佳作**）。論文 news 加 DOI 連結：ASJ 連 `10.1093/asj/sjag079`、**PRS Triangular Fossa 連 `10.1097/PRS.0000000000012647`**（6/20 論文正式線上刊登 PMID 41335126 後補上）、ABA 連 ameriburn.org |
| blog | `/blog/`（`_pages/blog.md`，nav:false，從 about portal + services 頁底連入）。**6/13 收斂成衛教 hub**：`blog_name`/`blog_description` 清空 → 頁面無大標、直接從 tag/category 篩選排開始；刪 al-folio 起手草稿（hello / benchmark-to-bedside）。⚠️ post 日期勿設未來時間，否則 Jekyll 跳過不 build |
| **機構 logo 牆**（about 頁底）| `_data/affiliations.yml`（每筆 name/logo/url/**height**）+ logo 檔放 `assets/img/logos/`（`cgmh.png` 24px + `nycu.png` 52px 實際使用；`cgmh-logo.svg` 向量原檔備用，未引用）。灰階+hover 變色。⚠️ **各 logo 長寬比不同→用 `height` 欄個別微調**。logo 進 public repo=永久公開，但機構商標屬事實性隸屬展示風險低。⚠️ 不從官網拓 logo，由 user 提供（media kit/名片）|

## 聯絡 / 帳號

- **about 頁底 contact 區塊＝兩個對等 channel**（`_layouts/about.liquid`；樣式 `_base.scss` `.contact-channel`）：各一顆 16px 灰階 icon＋文字連結，**無按鈕、無品牌色**（極簡區塊裡任何填色按鈕都是異物，user 否決過官方綠與自訂綠兩版）。說明文字 `contact_note`／`line_note` 目前**留空**（鍵保留；填值即顯示並自動加寬間距）
  - email：`contact@cjhuang.com`（**Cloudflare Email Routing → isly29@gmail.com，已驗證可收**）
  - LINE 官方帳號：`_config.yml` `line_url`／`line_label`／`line_note`；整段以 `{% if site.line_url %}` 包住——改網址或停用只動 config，不碰 layout。⚠️ 該帳號＝活躍醫病管道，bot 端 canonical `Automations/line_bot/README.md`
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

- 真臨床案例照（cases 頁 7/11 已整頁下架；放 public repo = 永久公開，需同意書涵蓋網路公開永久 + 去識別；上架 = 拿掉兩檔 `published: false` + services 頁補回連結）
- lab.cjhuang.com 站內容升級（接 ResearchTools demos / 補 publications）

**已完成 / 已決定不做**（從待補移除）：
- ✅ PRS Triangular Fossa news 連結（6/20，DOI `10.1097/PRS.0000000000012647`）
- ✅ 眼袋衛教文解剖示意圖（`assets/img/eye-bags-anatomy.jpg`，Gemini AI 生成）
- ✅ ORCID（6/12，`_data/socials.yml`）
- ❌ 國內 conference 補全 — **user 6/20 決定不補**（資料缺口不影響站定位）
- ❌ 其他機構 logo（TMU/CGU/NYU/SGH/Juntendo）— **user 6/20 決定不加**（都不適合放上去）；about logo 牆維持 CGMH + NYCU 兩個

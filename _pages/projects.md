---
layout: page
title: research
display_title: Academic Research
permalink: /research/
description: Clinically grounded AI for burn care, craniofacial and reconstructive surgery.
nav: true
nav_order: 2
---

My research sits at the intersection of **plastic & reconstructive surgery** and **applied AI**. Most projects start from a problem I meet in the burn unit or operating room, and aim for tools that are genuinely usable in clinical workflow rather than benchmark-only models.

## Clinical Research

Clinical-question-driven studies grounded in real practice and large-scale hospital data.

**Quantitative rhinoplasty.**
Photogrammetric, 3D-based frameworks for measuring and predicting nasal tip projection, rotation, and stability after cartilage grafting.

**Burn outcomes from the Chang Gung Research Database (CGRD).**
Large-scale clinical outcome studies — transfusion, infection and antimicrobial resistance, and length of stay — across decades of burn admissions.

**Craniofacial & orthognathic measurement.**
3D photogrammetry and CBCT-based assessment for orthognathic surgery planning, including Bad Split risk.

## AI & Computational

Deep-learning, computer-vision, and language methods built from the bedside outward.

**Burn wound segmentation & TBSA estimation.**
Automatic segmentation and total-body-surface-area estimation from clinical photographs.

**Inhalation-injury prediction.**
Machine-learning and multimodal models for early risk stratification of inhalation injury.

**Craniofacial deep learning.**
Landmark detection and segmentation on CBCT and 3D imaging — with a focus on the systematic errors that off-the-shelf Western models make on Asian Class III anatomy.

**Multimodal clinical AI.**
Vision–language and NLP methods for extracting structure from clinical narratives, imaging, and structured records.

---

## AI demos

Live, interactive demos of tools coming out of the lab — hosted on Hugging Face Spaces. The full collection lives on the <a href="https://lab.cjhuang.com" target="_blank">VDI Lab site</a>.

- **Burn wound segmentation** — Deep Supervision UNet++ (IoU 0.85) → [demo](https://huggingface.co/spaces/CJRonald/burn-segmentation-demo){:target="_blank"}
- **Flap perfusion prediction** — temperature + color features → [demo](https://huggingface.co/spaces/CJRonald/flap-prediction-demo){:target="_blank"}
  <br><em>Note: a 2022 research prototype with known patient-level data leakage — shown for transparency, not as a clinical tool.</em>

---

For the lab, team, and complete project list, visit <a href="https://lab.cjhuang.com" target="_blank">lab.cjhuang.com →</a>

---

## Selected publications

<div class="publications">
{% bibliography --group_by none --query @*[selected=true]* %}
</div>

<p><a href="{{ '/publications/' | relative_url }}">See all publications →</a></p>

---
layout: about
title: about
permalink: /
subtitle: Plastic & Reconstructive Surgeon · Burn Intensivist · AI Researcher — <a href='https://www.cgmh.org.tw/eng' target='_blank'>Chang Gung Memorial Hospital</a>

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  more_info:

selected_papers: false # publications shown on the research page instead
social: false # social icons at the bottom of the page (cv/email/github) — disabled

announcements:
  enabled: true # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true
  limit: 3

contact_email: contact@cjhuang.com
---

I am a **plastic and reconstructive surgeon** and **burn intensivist** at [Linkou Chang Gung Memorial Hospital](https://www.cgmh.org.tw/eng), and a Ph.D. student in Biomedical Informatics at [National Yang Ming Chiao Tung University (NYCU)](https://www.nycu.edu.tw/).

My clinical practice spans acute and reconstructive **burn care**, **rhinoplasty**, **craniofacial surgery**, and **microsurgery**. Alongside the operating room, I build **clinically grounded AI** — translating problems I meet at the bedside into models that are actually usable: burn wound segmentation and TBSA estimation, inhalation-injury risk prediction, craniofacial / orthognathic image analysis, and quantitative rhinoplasty planning.

I lead the **VDI Lab @ CGMH Burn Center** — a joint effort between the [Linkou Chang Gung Burn Center](https://cgmhburncenter.org){:target="_blank"}, NYCU, and Chang Gung University — where we develop vision, language, and multimodal models for burn and reconstructive care. You can explore the lab and its live AI demos on the <a href='https://lab.cjhuang.com' target='_blank'>lab site</a>.

{% if site.data.affiliations %}
<div class="affiliation-logos">
  {% for aff in site.data.affiliations %}
    {% if aff.url %}<a href="{{ aff.url }}" target="_blank" rel="noopener noreferrer" title="{{ aff.name }}">{% endif %}
    <img src="{{ '/assets/img/logos/' | append: aff.logo | relative_url }}" alt="{{ aff.name }}" loading="lazy"{% if aff.height %} style="height: {{ aff.height }};"{% endif %}>
    {% if aff.url %}</a>{% endif %}
  {% endfor %}
</div>
{% endif %}

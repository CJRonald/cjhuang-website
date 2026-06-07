---
layout: post
title: From benchmark to bedside
date: 2026-06-07 12:00:00+0800
description: Why a high IoU isn't the same as a useful tool — notes from building burn-care AI.
tags: clinical-ai burn
categories: notes
---

> Draft — first real post. Edit freely or tell me to rewrite the angle.

A model that scores well on a held-out test set and a model that helps in the burn unit are not the same thing. I've learned this the slow way.

Most published clinical-AI papers report a single headline number — an IoU, an AUC, an accuracy. Those numbers are necessary, but they quietly assume the hardest parts are already solved: that the input at the bedside looks like the training data, that the label you optimized for is the decision the clinician actually makes, and that the model fails loudly rather than silently.

A few things I keep running into:

**The data leakage you can't see in the metric.** One of my early projects — a flap-perfusion classifier from 2022 — looked good until I realized the train/test split wasn't patient-level. Multiple images of the same patient leaked across the split, inflating the score. I keep that demo online *with the limitation stated plainly*, because pretending otherwise is how clinical AI loses trust.

**The label is rarely the decision.** "Inhalation injury: yes/no" is a clean label. But the clinician's actual question is closer to "should I secure this airway in the next hour?" A model trained on the clean label can be accurate and still answer the wrong question.

**Off-the-shelf models carry hidden populations.** Western-trained craniofacial landmark models make systematic errors on Asian Class III anatomy — not random noise, but consistent bias. That gap *is* the research opportunity, but only if you measure it instead of trusting the benchmark.

None of this is an argument against AI in medicine. It's an argument for building it from the bedside outward: start from the decision, measure the failure modes, and be honest about what the tool can't do. That's most of the work, and it's the part the headline number never shows.

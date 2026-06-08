// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-research",
          title: "research",
          description: "Clinically grounded AI for burn care, craniofacial and reconstructive surgery.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-activities",
          title: "activities",
          description: "International conferences, invited talks, research mentorship, and academic exchange.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/activities/";
          },
        },{id: "nav-cases",
          title: "cases",
          description: "Selected clinical cases. All photographs are published with patient consent for online use.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cases/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-cv",
          title: "cv ↗",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/https:/www.linkedin.com/in/cjronald/";
          },
        },{id: "nav-lab",
          title: "lab ↗",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/https:/lab.cjhuang.com";
          },
        },{id: "post-認識眼袋與下眼瞼整形",
        
          title: "認識眼袋與下眼瞼整形",
        
        description: "眼袋與中臉老化的解剖機轉、手術技巧，以及結構式眼袋手術的設計理念。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/eyebag/";
          
        },
      },{id: "post-hello",
        
          title: "Hello",
        
        description: "A first note on this site and what I plan to write here.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/hello/";
          
        },
      },{id: "post-from-benchmark-to-bedside",
        
          title: "From benchmark to bedside",
        
        description: "Why a high IoU isn&#39;t the same as a useful tool — notes from building burn-care AI.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/benchmark-to-bedside/";
          
        },
      },{id: "news-started-my-ph-d-in-biomedical-informatics-at-national-yang-ming-chiao-tung-university-nycu-focusing-on-multimodal-ai-for-burn-and-reconstructive-care",
          title: 'Started my Ph.D. in Biomedical Informatics at National Yang Ming Chiao Tung University...',
          description: "",
          section: "News",},{id: "news-our-paper-on-combined-septal-extension-amp-amp-derotation-grafts-in-asian-rhinoplasty-324-cases-was-accepted-by-aesthetic-surgery-journal-a-quantitative-analysis-of-tip-projection-and-stability",
          title: 'Our paper on combined septal extension &amp;amp;amp; derotation grafts in Asian rhinoplasty (324...',
          description: "",
          section: "News",},{id: "news-promoted-to-assistant-professor-at-chang-gung-memorial-hospital",
          title: 'Promoted to Assistant Professor at Chang Gung Memorial Hospital. 🎓',
          description: "",
          section: "News",},{id: "news-two-burn-care-ai-demos-are-now-live-on-hugging-face-spaces-burn-wound-segmentation-unet-iou-0-85-and-flap-perfusion-prediction-try-them-on-the-lab-site",
          title: 'Two burn-care AI demos are now live on Hugging Face Spaces — burn...',
          description: "",
          section: "News",},{id: "projects-asian-rhinoplasty-septal-extension-amp-derotation-graft",
          title: 'Asian Rhinoplasty — Septal Extension &amp;amp; Derotation Graft',
          description: "Tip projection and rotation correction (sample case — replace with your own)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/case_01_rhinoplasty/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%63%6F%6E%74%61%63%74@%63%6A%68%75%61%6E%67.%63%6F%6D", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];

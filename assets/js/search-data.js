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
        },{id: "nav-services",
          title: "services",
          description: "Clinical services in plastic, reconstructive, burn, and aesthetic surgery.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/services/";
          },
        },{id: "nav-activities",
          title: "activities",
          description: "International conferences, invited talks, research mentorship, and academic exchange.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/activities/";
          },
        },{id: "post-認識自體脂肪移植-從淚溝到全臉年輕化",
        
          title: "認識自體脂肪移植：從淚溝到全臉年輕化",
        
        description: "自體脂肪移植的科學原理、存活與吸收機制、提高存活率的技術，以及從淚溝、中臉到全臉的立體年輕化設計理念。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/fat-grafting/";
          
        },
      },{id: "post-認識鼻整形-東方鼻的美學-術式與選擇",
        
          title: "認識鼻整形：東方鼻的美學、術式與選擇",
        
        description: "從東方鼻的解剖特性、理想鼻形比例，到隆鼻材料與術式選擇、術後照護的完整入門指南。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/rhinoplasty-basics/";
          
        },
      },{id: "post-認識眼袋與下眼瞼整形",
        
          title: "認識眼袋與下眼瞼整形",
        
        description: "眼袋與中臉老化的解剖機轉、手術技巧，以及結構式眼袋手術的設計理念。",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/eyebag/";
          
        },
      },{id: "news-our-paper-triangular-fossa-cartilage-graft-in-rhinoplasty-a-three-dimensional-anatomical-and-technical-feasibility-study-was-accepted-by-plastic-and-reconstructive-surgery-a-three-dimensional-anatomical-study-validating-the-auricular-triangular-fossa-as-a-donor-site-for-structural-grafting",
          title: 'Our paper Triangular Fossa Cartilage Graft in Rhinoplasty: A Three-Dimensional Anatomical and Technical...',
          description: "",
          section: "News",},{id: "news-our-paper-on-combined-septal-extension-amp-amp-derotation-grafts-in-asian-rhinoplasty-324-cases-was-accepted-by-aesthetic-surgery-journal-a-quantitative-analysis-of-tip-projection-and-stability",
          title: 'Our paper on combined septal extension &amp;amp;amp; derotation grafts in Asian rhinoplasty (324...',
          description: "",
          section: "News",},{id: "news-presented-a-poster-multimodal-deep-learning-with-feature-level-fusion-for-inhalation-injury-severity-prediction-in-burn-patients-at-the-american-burn-association-aba-annual-meeting-in-orlando-florida",
          title: 'Presented a poster, Multimodal Deep Learning with Feature-level Fusion for Inhalation Injury Severity...',
          description: "",
          section: "News",},{id: "news-promoted-to-assistant-professor-at-chang-gung-memorial-hospital",
          title: 'Promoted to Assistant Professor at Chang Gung Memorial Hospital. 🎓',
          description: "",
          section: "News",},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%63%6F%6E%74%61%63%74@%63%6A%68%75%61%6E%67.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=o5hHtnQAAAAJ", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/cjronald", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0006-8111-5329", "_blank");
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

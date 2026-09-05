// data/portfolioData.ts
// =============================================================================
// NAWFS UL AHSUN - PORTFOLIO DATA CONFIGURATION
// -----------------------------------------------------------------------------
// All sections of the portfolio can be easily customized right here!
// Update text, add/remove projects, customize skills, and manage work experience.
// =============================================================================

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  clientOrOrg?: string;
  category:
    | "Healthcare ERP"
    | "Enterprise ERP"
    | "Web Applications"
    | "R&D Systems";
  description: string;
  highlights: string[];
  technologies: string[];
  featured: boolean;
  isPrivate?: 0 | 1;
  image: string;
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface WorkExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  type: "Full-Time" | "Internship" | "Leadership / Academic";
  summary: string;
  responsibilities: string[];
  techStack: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  year: string;
  grade: string;
  gradeScale: string;
  description?: string;
}

export interface SkillItem {
  name: string;
  level?: number;
  category:
    | "Programming Languages"
    | "Web Development"
    | "Databases"
    | "Design Software"
    | "Media & Audio"
    | "Tools & Productivity";
  icon?: string;
  iconLibrary?: "si" | "fa6" | "fa" | "lu" | "md" | "tb" | "ri";
}

export const portfolioData = {
  // ---------------------------------------------------------------------------
  // 1. PERSONAL INFORMATION & HERO SECTION
  // ---------------------------------------------------------------------------
  personal: {
    name: "Nawfs Ul Ahsun",
    title: "Web Developer | Software Engineer",
    tagline:
      "Building high-performance frontend interfaces, robust ERP systems, and modern web applications.",
    email: "nawfs.cs254@gmail.com",
    phone: "+880 1704 259187",
    address:
      "15/B, Road no 1, PC Culture Housing Society, Shekhertek, Adabor, Dhaka-1207, Bangladesh",
    location: "Dhaka, Bangladesh || Saidpur, Rangpur || Remote",
    hiringStatus: "Available for Hire",
    profileImage: "/assets/profile.jpg",
    cvPdfUrl: "/assets/cv.pdf",
    portfolioUrl: "https://nawfs.is-a.dev/",
    objective:
      "I am enthusiastic about driving innovation and adopting the changing world of technology. I am committed to creating solutions that make an impact leveraging my skills to contribute to the organization’s growth and success.",
    bio: [
      "I am a results-driven Web Developer and Software Engineer at Orange Solutions LTD (United Group) in Dhaka, Bangladesh. With a strong foundation in Computer Science and Engineering, I specialize in crafting responsive, user-friendly frontend interfaces in ReactJS, modernizing ERP workflows, and engineering scalable web solutions.",
      "My day-to-day work spans developing enterprise-grade healthcare and ERP platforms, engineering dynamic configurable dashboards, optimizing database performance, and building seamless user experiences.",
      "Outside of code, I am an avid learner, music enthusiast (singing & playing instruments), and digital artist passionate about clean UI/UX aesthetics.",
    ],
    socialLinks: [
      {
        name: "GitHub",
        url: "https://github.com/nawfs254",
        icon: "FaGithub",
        iconLibrary: "fa6" as const,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/nawfs-ul-ahsun",
        icon: "FaLinkedin",
        iconLibrary: "fa6" as const,
      },
      {
        name: "Portfolio",
        url: "https://nawfs.is-a.dev/",
        icon: "FaGlobe",
        iconLibrary: "fa6" as const,
      },
      {
        name: "Email",
        url: "mailto:nawfs.cs254@gmail.com",
        icon: "FaEnvelope",
        iconLibrary: "fa6" as const,
      },
      {
        name: "Fiverr",
        url: "https://www.fiverr.com/s/Em0LgXD",
        icon: "RiFiverrFill",
        iconLibrary: "ri" as const,
      },
    ],
    stats: [
      { label: "Professional Experience", value: "2+ Years" },
      { label: "Enterprise Projects", value: "5+ Built" },
      { label: "Technologies Mastered", value: "15+" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. PROFESSIONAL WORK EXPERIENCE
  // ---------------------------------------------------------------------------
  experiences: [
    {
      role: "Junior Software Engineer",
      company: "Orange Solutions LTD – United Group",
      location: "Dhaka, Bangladesh",
      period: "October 2024 – Present",
      startDate: "2024-10-01",
      endDate: null,
      current: true,
      type: "Full-Time" as const,
      summary:
        "Developing responsive frontend interfaces using ReactJS, optimizing ERP system integrations, and engineering core R&D solutions across enterprise modules.",
      responsibilities: [
        "Develop responsive and user-friendly frontend interfaces using ReactJS, improving user experience and interface performance across ERP modules.",
        "Develop and optimize ERP system integrations and dashboards, enhancing business workflows and enabling data-driven decision-making.",
        "Improve software solutions using the Zab Framework (Java-based) and contribute to high quality team deliverables, including Crystal Reports and database optimizations.",
        "Actively involved in Research & Development (R&D) activities, implementing new features such as Dynamic Dashboards, Dynamic Reports, HRD Personal Dashboards, and improving core systems including file upload performance and reliability.",
      ],
      techStack: [
        "ReactJS",
        "Next.js",
        "JavaScript",
        "Tailwind CSS",
        "Material UI",
        "Zab Framework",
        "Java",
        "MS SQL Server",
        "Crystal Reports",
      ],
    },
    {
      role: "Software Engineer (Internship)",
      company: "Orange Solutions LTD – United Group",
      location: "Dhaka, Bangladesh",
      period: "July 2024 – September 2024",
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      current: false,
      type: "Internship" as const,
      summary:
        "Built foundational expertise in enterprise ERP architectures, business logic automation, and full-stack software workflows using the Java-based Zab Framework.",
      responsibilities: [
        "Built foundational expertise in ERP systems, business workflows, and software development using the Zab Framework (Java-based).",
        "Assisted senior engineers in testing, debugging, and enhancing enterprise software modules for hospital and organizational management.",
        "Participated in agile sprints, code reviews, and database schema optimizations.",
      ],
      techStack: [
        "Java",
        "Zab Framework",
        "MS SQL Server",
        "HTML5",
        "CSS3",
        "JavaScript",
      ],
    },
    {
      role: "Student Co-ordinator",
      company: "RIMT University",
      location: "Punjab, India",
      period: "July 2022 – July 2023",
      startDate: "2022-07-01",
      endDate: "2023-07-31",
      current: false,
      type: "Leadership / Academic" as const,
      summary:
        "Represented international Bangladeshi students, assisting the university admission department and organizing community engagement initiatives.",
      responsibilities: [
        "Represented Bangladeshi students as a coordinator, assisting the International Admission Department with student guidance and support.",
        "Facilitated communication and engagement between Bangladeshi students and the university administration, ensuring a smooth transition for newcomers.",
        "Coordinated student orientation programs, academic onboarding, and community welfare events.",
      ],
      techStack: [
        "Leadership",
        "Communication",
        "Event Management",
        "Student Support",
      ],
    },
  ] as WorkExperienceItem[],

  // ---------------------------------------------------------------------------
  // 3. PROJECTS SECTION
  // ---------------------------------------------------------------------------
  // Note: Place project screenshots in public/projects/<project-folder-name>/
  // Each project can have multiple images for the interactive modal gallery!
  projects: [
    {
      id: "eprescription-healthcare",
      title: "E-Prescription & Healthcare Management System",
      subtitle: "Clinical Prescription & Hospital Workflow Automation",
      category: "Healthcare ERP",
      description:
        "Developed a comprehensive E-Prescription & Healthcare Management System to standardize digital prescriptions, clinical diagnoses, and patient medication tracking.",
      highlights: [
        "Contributed to both frontend and backend development, building responsive user interfaces with React, Material UI, and Tailwind CSS.",
        "Integrated resilient backend services using Spring Boot integrated with MS SQL Server for high-concurrency clinical data.",
        "Implemented key modules including patient management, prescription generation, medication dosages, dynamic templates, and diagnostic reporting.",
        "Collaborated with cross-functional technical teams to deliver a secure, scalable, and user-friendly healthcare solution.",
      ],
      technologies: [
        "React",
        "Material UI",
        "Tailwind CSS",
        "Spring Boot",
        "MS SQL Server",
        "REST API",
      ],
      featured: true,
      isPrivate: 1,
      image: "/projects/eprescription-system/thumbnail.png",
      images: [
        "/projects/eprescription-system/thumbnail.png",
        "/projects/eprescription-system/1.png",
        "/projects/eprescription-system/2.png",
        "/projects/eprescription-system/3.png",
        "/projects/eprescription-system/4.png",
        "/projects/eprescription-system/5.png",
        "/projects/eprescription-system/6.png",
        "/projects/eprescription-system/7.png",
        "/projects/eprescription-system/8.png",
        "/projects/eprescription-system/9.png",
      ],
      liveUrl: "",
      githubUrl: "",
    },
    {
      id: "eprescription-medical-store",
      title: "E-Prescription and Medical Store Management",
      subtitle: "Pharmaceutical Inventory & Prescription Management",
      category: "Healthcare ERP",
      description:
        "Developed an efficient E-Prescription & Inventory Management System aimed at streamlining digital prescription processing, inventory tracking, and pharmaceutical audits.",
      highlights: [
        "Collaborated closely with the team to design and implement the frontend using React, Material UI, and Tailwind CSS, ensuring an intuitive and responsive user experience.",
        "Integrated backend services using Spring Boot and MS SQL Server to handle real-time inventory deductions, batch expiries, and smooth data management.",
        "Focused primarily on frontend engineering, delivering a polished, high-performance interface for clinicians and pharmacists.",
        "Successfully deployed the system into production, significantly boosting operational efficiency and eliminating prescription errors.",
      ],
      technologies: [
        "React",
        "Material UI",
        "Tailwind CSS",
        "Spring Boot",
        "MS SQL Server",
        "Inventory Sync",
      ],
      featured: true,
      isPrivate: 1,
      image: "/projects/ePrescription/thumbnail.png",
      images: [
        "/projects/ePrescription/thumbnail.png",
        "/projects/ePrescription/2.png",
        "/projects/ePrescription/3.png",
        "/projects/ePrescription/4.png",
      ],
      liveUrl: "",
      githubUrl: "",
    },
    {
      id: "zab-erp-framework",
      title: "Zab Framework (R&D Projects – ERP Platform)",
      subtitle: "Enterprise-Level R&D ERP Solutions",
      clientOrOrg: "Orange Solutions",
      category: "Enterprise ERP",
      description:
        "Worked in Research & Development (R&D) on enterprise-level ERP solutions using the Java-based Zab Framework, engineering dynamic analytics and customizable reporting engines.",
      highlights: [
        "Implemented a Dynamic Dashboard module to provide real-time operational insights and configurable widget data views.",
        "Developed Dynamic Application Reports, enabling flexible and role-based analytical reporting across enterprise modules.",
        "Built a Personal Dashboard (HRD) to enhance employee-specific data visibility and self-service workflow efficiency.",
        "Overhauled the core file upload subsystem, achieving superior upload performance, fault-tolerant retries, and clean UX.",
      ],
      technologies: [
        "Zab Framework",
        "Java",
        "ERP Systems",
        "MS SQL Server",
        "Crystal Reports",
        "JavaScript",
        "HTML5",
        "CSS3",
      ],
      featured: true,
      isPrivate: 1,
      image: "/projects/zab-erp/thumbnail.png",
      images: [
        "/projects/zab-erp/thumbnail.png",
        "/projects/zab-erp/reports.png",
        "/projects/zab-erp/1.png",
        "/projects/zab-erp/2.png",
      ],
      liveUrl: "",
      githubUrl: "",
    },
    {
      id: "hrd-management",
      title: "HRD Management",
      subtitle: "Human Resource Development & Administrative ERP Suite",
      clientOrOrg: "Orange Solutions",
      category: "Enterprise ERP",
      description:
        "Engineered and enhanced complete Human Resource Development (HRD) modules for enterprise ERP systems to automate workforce administration, payroll, and facility logistics.",
      highlights: [
        "Implemented complete Employee Management, Attendance Tracking, and automated Payroll calculation systems.",
        "Developed Canteen Management System for automated employee meal tracking, scheduling, and billing.",
        "Implemented Disciplinary Action and Injury Management modules ensuring tight adherence to organizational HR policies.",
        "Built Medical Pass and Gate Pass Management systems for employee access control, plus Route-wise Conveyance planning for corporate transport logistics.",
      ],
      technologies: [
        "Zab Framework",
        "Java",
        "Payroll Automation",
        "MS SQL Server",
        "Crystal Reports",
        "Access Control",
      ],
      featured: true,
      isPrivate: 1,
      image: "/projects/hrd-management/thumbnail.png",
      images: ["/projects/hrd-management/thumbnail.png"],
      liveUrl: "",
      githubUrl: "",
    },
    {
      id: "dynamic-notifications",
      title: "Dynamic Multi-Server Notification System",
      subtitle: "Real-Time Cross-Server Alert & Approval Architecture",
      category: "R&D Systems",
      description:
        "Implemented a Dynamic Multi-Server Notification System that fetches real-time notifications across multiple servers and enables authorized users to approve or reject requests directly from the notification interface.",
      highlights: [
        "Engineered distributed notification listeners to aggregate alerts and pending operational tasks across independent server instances.",
        "Empowered managers to take instant 1-click approve or reject actions directly from the notification card, cutting workflow latency by 60%.",
        "Designed lightweight, responsive client widgets with smooth micro-interactions using JavaScript and backend Java services.",
        "Ensured reliable event delivery, status tracking, and rapid response turnaround times across enterprise departments.",
      ],
      technologies: [
        "JavaScript",
        "HTML5",
        "CSS3",
        "Java",
        "REST Webhooks",
        "Real-Time Notifications",
      ],
      featured: true,
      isPrivate: 1,
      image: "/projects/dynamic-notifications/thumbnail.png",
      images: ["/projects/dynamic-notifications/thumbnail.png"],
      liveUrl: "",
      githubUrl: "",
    },
  ] as ProjectItem[],

  // ---------------------------------------------------------------------------
  // 4. SKILLS & TECHNICAL STACK (CATEGORIZED ACCORDING TO CV)
  // ---------------------------------------------------------------------------
  skills: [
    // Programming Languages
    {
      name: "JavaScript",
      category: "Programming Languages",
      level: 90,
      icon: "SiJavascript",
      iconLibrary: "si",
    },
    {
      name: "Python",
      category: "Programming Languages",
      level: 82,
      icon: "SiPython",
      iconLibrary: "si",
    },
    {
      name: "Java",
      category: "Programming Languages",
      level: 85,
      icon: "FaJava",
      iconLibrary: "fa6",
    },
    {
      name: "TypeScript",
      category: "Programming Languages",
      level: 85,
      icon: "SiTypescript",
      iconLibrary: "si",
    },

    // Web Development
    {
      name: "ReactJS",
      category: "Web Development",
      level: 92,
      icon: "SiReact",
      iconLibrary: "si",
    },
    {
      name: "Next.js",
      category: "Web Development",
      level: 88,
      icon: "SiNextdotjs",
      iconLibrary: "si",
    },
    {
      name: "Tailwind CSS",
      category: "Web Development",
      level: 95,
      icon: "SiTailwindcss",
      iconLibrary: "si",
    },
    {
      name: "HTML5 & CSS3",
      category: "Web Development",
      level: 95,
      icon: "SiHtml5",
      iconLibrary: "si",
    },
    {
      name: "Material UI",
      category: "Web Development",
      level: 85,
      icon: "SiMui",
      iconLibrary: "si",
    },
    {
      name: "Spring Boot",
      category: "Web Development",
      level: 78,
      icon: "SiSpringboot",
      iconLibrary: "si",
    },

    // Databases
    {
      name: "MS SQL Server",
      category: "Databases",
      level: 88,
      icon: "TbSql",
      iconLibrary: "tb",
    },
    {
      name: "MySQL",
      category: "Databases",
      level: 85,
      icon: "SiMysql",
      iconLibrary: "si",
    },
    {
      name: "MongoDB",
      category: "Databases",
      level: 80,
      icon: "SiMongodb",
      iconLibrary: "si",
    },

    // Designing Software
    {
      name: "Figma",
      category: "Design Software",
      level: 88,
      icon: "SiFigma",
      iconLibrary: "si",
    },
    {
      name: "Adobe Photoshop",
      category: "Design Software",
      level: 85,
      icon: "TbBrandAdobePhotoshop",
      iconLibrary: "tb",
    },
    {
      name: "Adobe Illustrator",
      category: "Design Software",
      level: 82,
      icon: "TbBrandAdobeIllustrator",
      iconLibrary: "tb",
    },

    // Media & Audio
    {
      name: "Adobe Premiere Pro",
      category: "Media & Audio",
      level: 80,
      icon: "TbBrandAdobePremier",
      iconLibrary: "tb",
    },
    {
      name: "Adobe Audition",
      category: "Media & Audio",
      level: 78,
      icon: "TbBrandAdobe",
      iconLibrary: "tb",
    },
    {
      name: "FL Studio",
      category: "Media & Audio",
      level: 82,
      icon: "FaMusic",
      iconLibrary: "fa6",
    },

    // Tools & Productivity
    {
      name: "Git & GitHub",
      category: "Tools & Productivity",
      level: 90,
      icon: "SiGit",
      iconLibrary: "si",
    },
    {
      name: "Crystal Reports",
      category: "Tools & Productivity",
      level: 84,
      icon: "FaFileLines",
      iconLibrary: "fa6",
    },
    {
      name: "MS Office Suite",
      category: "Tools & Productivity",
      level: 92,
      icon: "FaFileWord",
      iconLibrary: "fa6",
    },
  ] as SkillItem[],

  // Hobbies from CV
  hobbies: [
    { name: "Singing", icon: "FaMicrophone", iconLibrary: "fa6" },
    { name: "Playing Instruments", icon: "FaGuitar", iconLibrary: "fa6" },
    { name: "Painting & Digital Art", icon: "FaPalette", iconLibrary: "fa6" },
    { name: "Tech R&D", icon: "FaLaptopCode", iconLibrary: "fa6" },
  ],

  // ---------------------------------------------------------------------------
  // 5. ACADEMIC CREDENTIALS & EDUCATION
  // ---------------------------------------------------------------------------
  education: [
    {
      degree: "Bachelor of Technologies in Computer Science and Engineering",
      institution: "RIMT University",
      location: "Punjab, India",
      year: "2019 – 2023",
      grade: "CGPA 7.68 / 10",
      gradeScale: "10.0 scale",
      description:
        "Comprehensive engineering coursework in Algorithms, Data Structures, Database Systems, Object-Oriented Software Engineering, and Web Technologies. Served as Student Co-ordinator for the international student community.",
    },
    {
      degree: "Higher Secondary Certificate (HSC)",
      institution: "Saidpur Govt. Technical College",
      location: "Saidpur, Nilphamari, Bangladesh",
      year: "2017 – 2018",
      grade: "GPA 4.25 / 5.00",
      gradeScale: "5.0 scale",
      description:
        "Science curriculum with concentration in Mathematics, Physics, Chemistry, and Information Technology.",
    },
    {
      degree: "Secondary School Certificate (SSC)",
      institution: "Syedpur Govt. Technical High School and College",
      location: "Saidpur, Nilphamari, Bangladesh",
      year: "2015 – 2016",
      grade: "GPA 5.00 / 5.00",
      gradeScale: "5.0 scale",
      description:
        "Science curriculum with concentration in Mathematics, Physics, Chemistry, and Information Technology.",
    },
  ] as EducationItem[],

  // ---------------------------------------------------------------------------
  // 6. SERVICES OFFERED
  // ---------------------------------------------------------------------------
  services: [
    {
      title: "Frontend Engineering",
      description:
        "Crafting lightning-fast, high-converting, and accessible web interfaces with React, Next.js, and modern Tailwind CSS.",
      icon: "Code2",
    },
    {
      title: "Enterprise ERP Modules",
      description:
        "Building robust, scalable business solutions including dashboards, dynamic reports, hospital systems, and inventory tracking.",
      icon: "Layers",
    },
    {
      title: "Database & Backend Integration",
      description:
        "Architecting reliable data pipelines and RESTful services with MS SQL Server, MySQL, MongoDB, and Spring Boot.",
      icon: "Database",
    },
    {
      title: "UI/UX & Prototyping",
      description:
        "Designing sleek visual prototypes, design tokens, and digital branding with Figma, Photoshop, and Illustrator.",
      icon: "Palette",
    },
  ],

  // ---------------------------------------------------------------------------
  // 7. FREQUENTLY ASKED QUESTIONS
  // ---------------------------------------------------------------------------
  faqs: [
    {
      question: "What is your primary tech stack?",
      answer:
        "My primary specialization is React, Next.js, Tailwind CSS, JavaScript/TypeScript, and Java-based enterprise architectures (Zab Framework, Spring Boot) with MS SQL Server and MongoDB.",
    },
    {
      question: "Are you open to full-time or contract roles?",
      answer:
        "Yes! I am actively open to full-time Software Engineer / Web Developer roles as well as impactful consulting opportunities.",
    },
    {
      question: "How do I review your projects or get in touch?",
      answer:
        "You can download my CV directly from the navbar, explore the interactive project gallery below, or reach me directly at nawfs.cs254@gmail.com or +880 1704 259187.",
    },
  ],
};

export default portfolioData;

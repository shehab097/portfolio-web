/**
 * The complete portfolio, as data.
 *
 * This is the *fallback* copy — it is what visitors see before Firestore
 * responds, and what the site falls back to if the database is unreachable.
 * Editing happens in the admin (`/admin`) and is saved to the Firestore
 * document `portfolio/content`.
 */

export const defaultContent = {
  site: {
    title: 'Shehab Sarder — Software Developer',
    description:
      'Portfolio of Shehab Sarder, software developer and Computer Science & Engineering student.',
  },

  navbar: {
    links: [
      { name: 'Home', href: '#' },
      { name: 'Projects', href: '#projects' },
      { name: 'Skills', href: '#skills' },
      { name: 'About', href: '#about' },
      { name: 'Contact', href: '#contact' },
    ],
  },

  hero: {
    role: 'Software Developer & CSE Student',
    name: 'Shehab Sarder',
    bio: 'I build practical software with a focus on backend development, web applications, and machine learning.',
    focus: 'Currently exploring Java, Spring Boot, React, and PyTorch.',
    links: [
      { label: 'GitHub', href: 'https://github.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com' },
      { label: 'Résumé', href: '#resume' },
    ],
  },

  projects: {
    label: 'Selected Works',
    heading: 'Featured Projects',
    /** How many projects are shown before "See More Projects" appears. */
    previewCount: 3,
    items: [
      {
        title: 'StrayCat',
        subtitle: 'Road Surface Detection System',
        description:
          'A computer-vision system designed to detect road damage such as potholes, cracks, and puddles from images captured using a mobile device.',
        tech: ['Python', 'PyTorch', 'Computer Vision', 'Android', 'REST API'],
        github: 'https://github.com',
        demo: 'https://example.com',
        image:
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        video: 'https://youtu.be/FtutLA63Cp8?si=Zwzbm6FjotzCa5T0',
      },
      {
        title: 'University Department Management System',
        subtitle: 'Academic Management Platform',
        description:
          'A web and mobile platform for managing students, teachers, courses, attendance, and academic information securely.',
        tech: ['Java', 'Spring Boot', 'React', 'React Native', 'MySQL', 'JWT'],
        github: 'https://github.com',
        demo: 'https://example.com',
        image:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        video: '',
      },
      {
        title: 'Personal Portfolio',
        subtitle: 'Dynamic Portfolio & Admin Dashboard',
        description:
          'A dynamic portfolio with an admin dashboard for managing projects, skills, and other content seamlessly.',
        tech: ['React', 'Firebase'],
        github: 'https://github.com',
        demo: 'https://example.com',
        image: '',
        video: 'https://youtu.be/dQw4w9WgXcQ',
      },
      {
        title: 'Project Alpha',
        subtitle: 'Utility Tool',
        description:
          'Short one-line description for secondary project alpha focusing on high-speed data parsing.',
        tech: ['JavaScript', 'Tailwind', 'Node.js'],
        github: 'https://github.com',
        demo: 'https://example.com',
        image:
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
        video: '',
      },
      {
        title: 'Project Beta',
        subtitle: 'CLI Utility',
        description:
          'Short one-line description for secondary project beta automating deployment routines.',
        tech: ['Python', 'Bash'],
        github: 'https://github.com',
        demo: 'https://example.com',
        image:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        video: '',
      },
      {
        title: 'Project Gamma',
        subtitle: 'Automation Script',
        description:
          'Short one-line description for secondary project gamma handling multi-source feeds.',
        tech: ['TypeScript', 'Express'],
        github: 'https://github.com',
        demo: 'https://example.com',
        image:
          'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=1200&q=80',
        video: '',
      },
    ],
  },

  skills: {
    label: 'Expertise',
    heading: 'Skills & Technologies',
    categories: [
      {
        category: 'Programming',
        skills: [
          { name: 'Java', icon: 'java' },
          { name: 'Python', icon: 'python' },
          { name: 'C++', icon: 'cpp' },
          { name: 'SQL', icon: 'sql' },
        ],
      },
      {
        category: 'Backend',
        skills: [
          { name: 'Spring Boot', icon: 'spring-boot' },
          { name: 'REST APIs', icon: 'rest-api' },
          { name: 'JPA/Hibernate', icon: 'hibernate' },
          { name: 'Spring Security', icon: 'security' },
          { name: 'JWT', icon: 'jwt' },
        ],
      },
      {
        category: 'Frontend',
        skills: [
          { name: 'React', icon: 'react' },
          { name: 'React Native', icon: 'react-native' },
          { name: 'HTML', icon: 'html' },
          { name: 'CSS', icon: 'css' },
          { name: 'JavaScript', icon: 'javascript' },
        ],
      },
      {
        category: 'Machine Learning',
        skills: [
          { name: 'PyTorch', icon: 'pytorch' },
          { name: 'Scikit-learn', icon: 'scikit-learn' },
          { name: 'Computer Vision', icon: 'computer-vision' },
          { name: 'Data Processing', icon: 'data-processing' },
        ],
      },
      {
        category: 'Database & Tools',
        skills: [
          { name: 'MySQL', icon: 'mysql' },
          { name: 'PostgreSQL', icon: 'postgresql' },
          { name: 'Firebase', icon: 'firebase' },
          { name: 'Git', icon: 'git' },
          { name: 'Linux', icon: 'linux' },
          { name: 'Docker', icon: 'docker' },
        ],
      },
    ],
  },

  about: {
    label: 'Background',
    heading: 'About Me',
    sections: [
      {
        title: 'Education',
        /** "text" = stacked title/subtitle/description, "cards" = icon cards. */
        layout: 'text',
        items: [
          {
            title: 'Bachelor of Science in Computer Science & Engineering',
            subtitle: 'National Institute of Textile Engineering and Research (NITER)',
            description:
              'Currently pursuing undergraduate studies in Computer Science & Engineering.',
            icon: 'file-text',
          },
        ],
      },
      {
        title: 'Focus & Growth',
        layout: 'cards',
        items: [
          {
            title: 'Backend Development',
            subtitle: '',
            description:
              'Building deeper knowledge of Java, Spring Boot, databases, security, and scalable APIs.',
            icon: 'server',
          },
          {
            title: 'Machine Learning',
            subtitle: '',
            description: 'Working with PyTorch and developing practical computer-vision projects.',
            icon: 'brain',
          },
          {
            title: 'Systems',
            subtitle: '',
            description:
              'Exploring Linux, computer architecture, networking, and lower-level programming.',
            icon: 'cpu',
          },
        ],
      },
    ],
  },

  contact: {
    label: 'Get in Touch',
    heading: 'Contact',
    intro:
      "I'm open to interesting projects, collaborations, internships, and software-development opportunities.",
    note: 'Feel free to reach out through any of the channels listed. I look forward to connecting with you.',
    links: [
      {
        label: 'Email',
        value: 'hello@example.com',
        href: 'mailto:hello@example.com',
        icon: 'mail',
      },
      {
        label: 'GitHub',
        value: 'github.com/username',
        href: 'https://github.com',
        icon: 'github',
      },
      {
        label: 'LinkedIn',
        value: 'linkedin.com/in/username',
        href: 'https://linkedin.com',
        icon: 'linkedin',
      },
    ],
  },
}

/** Ordered list of editable top-level sections (drives the admin sidebar). */
export const CONTENT_SECTIONS = ['site', 'navbar', 'hero', 'projects', 'skills', 'about', 'contact']

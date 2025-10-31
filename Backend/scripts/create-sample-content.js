const mongoose = require('mongoose');
const Service = require('../src/models/Service');
const Realisation = require('../src/models/Realisation');
const Article = require('../src/models/Article');
const Team = require('../src/models/Team');
const Testimonial = require('../src/models/Testimonial');
const Product = require('../src/models/Product');
require('dotenv').config();

const sampleServices = [
  {
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies including React, Node.js, and TypeScript. We create scalable, performant web solutions tailored to your business needs.',
    features: ['React & Next.js', 'Node.js Backend', 'TypeScript', 'Database Design', 'API Development', 'Responsive Design'],
    pricing: 'Starting from $2,500',
    duration: '2-4 weeks',
    icon: 'code'
  },
  {
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications for iOS and Android. We use React Native and Flutter to deliver high-quality mobile experiences.',
    features: ['React Native', 'Flutter', 'iOS Development', 'Android Development', 'App Store Deployment', 'Push Notifications'],
    pricing: 'Starting from $3,500',
    duration: '3-6 weeks',
    icon: 'smartphone'
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful, user-friendly designs that convert visitors into customers. We create wireframes, prototypes, and pixel-perfect designs.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing', 'Design Systems'],
    pricing: 'Starting from $1,500',
    duration: '1-3 weeks',
    icon: 'palette'
  },
  {
    title: 'Digital Marketing',
    description: 'Comprehensive digital marketing strategies to grow your online presence. SEO, social media, content marketing, and paid advertising.',
    features: ['SEO Optimization', 'Social Media Strategy', 'Content Marketing', 'PPC Advertising', 'Email Marketing', 'Analytics & Reporting'],
    pricing: 'Starting from $800/month',
    duration: 'Ongoing',
    icon: 'trending-up'
  }
];

const sampleRealisations = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with advanced product management, payment integration, and admin dashboard. Built with React, Node.js, and MongoDB.',
    image: '/images/portfolio/ecommerce.jpg',
    client: 'TechCorp Solutions',
    date: '2024-01-15',
    category: 'Web Development',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    link: 'https://techcorp-ecommerce.com',
    featured: true
  },
  {
    title: 'Healthcare Management System',
    description: 'A comprehensive healthcare management system for clinics and hospitals. Features include patient management, appointment scheduling, and medical records.',
    image: '/images/portfolio/healthcare.jpg',
    client: 'MediCare Plus',
    date: '2023-12-20',
    category: 'Healthcare',
    tags: ['Vue.js', 'Laravel', 'MySQL', 'HIPAA Compliant'],
    link: 'https://medicare-plus.com',
    featured: true
  },
  {
    title: 'Restaurant Ordering App',
    description: 'A mobile app for restaurant orders with real-time tracking, payment integration, and loyalty program. Available on iOS and Android.',
    image: '/images/portfolio/restaurant.jpg',
    client: 'Bella Vista Restaurant',
    date: '2023-11-10',
    category: 'Mobile Development',
    tags: ['React Native', 'Firebase', 'Stripe', 'Push Notifications'],
    link: 'https://apps.apple.com/app/bella-vista',
    featured: false
  },
  {
    title: 'Financial Dashboard',
    description: 'A comprehensive financial dashboard for small businesses with expense tracking, invoicing, and financial reporting capabilities.',
    image: '/images/portfolio/financial.jpg',
    client: 'SmallBiz Finance',
    date: '2023-10-05',
    category: 'Web Development',
    tags: ['Angular', 'Python', 'PostgreSQL', 'Data Visualization'],
    link: 'https://smallbiz-finance.com',
    featured: false
  },
  {
    title: 'Learning Management System',
    description: 'An online learning platform with course creation, student management, assessments, and progress tracking for educational institutions.',
    image: '/images/portfolio/lms.jpg',
    client: 'EduTech Institute',
    date: '2023-09-18',
    category: 'Education',
    tags: ['React', 'Express.js', 'MongoDB', 'Video Streaming'],
    link: 'https://edutech-institute.com',
    featured: false
  }
];

const sampleArticles = [
  {
    title: 'The Future of Web Development: Trends to Watch in 2024',
    content: `
      <h2>Introduction</h2>
      <p>As we move into 2024, the web development landscape continues to evolve at a rapid pace. New technologies, frameworks, and methodologies are emerging that promise to reshape how we build digital experiences.</p>

      <h2>Key Trends</h2>

      <h3>1. AI and Machine Learning Integration</h3>
      <p>Artificial intelligence is becoming increasingly integrated into web applications. From chatbots to content personalization, AI is enhancing user experiences across the board.</p>

      <h3>2. WebAssembly (WASM)</h3>
      <p>WebAssembly allows running high-performance code in browsers, enabling complex applications that were previously only possible with native development.</p>

      <h3>3. Server-Side Rendering (SSR) and Static Site Generation (SSG)</h3>
      <p>Performance and SEO continue to drive the adoption of SSR and SSG frameworks like Next.js, Nuxt.js, and Astro.</p>

      <h2>Conclusion</h2>
      <p>Staying ahead of these trends will be crucial for developers and businesses looking to create cutting-edge web experiences in 2024.</p>
    `,
    excerpt: 'Explore the latest trends shaping web development in 2024, from AI integration to new performance technologies.',
    author: 'Tech Editor',
    category: 'Technology',
    tags: ['Web Development', 'AI', 'JavaScript', 'Trends'],
    image: '/images/articles/web-trends-2024.jpg',
    published: true,
    featured: true,
    readTime: '5 min',
    status: 'published'
  },
  {
    title: 'Building Scalable React Applications: Best Practices',
    content: `
      <h2>Introduction</h2>
      <p>React has become the go-to library for building modern web applications. However, as applications grow in complexity, maintaining scalability becomes a significant challenge.</p>

      <h2>Architecture Patterns</h2>

      <h3>Component Composition</h3>
      <p>Effective component composition is key to building maintainable React applications. Use composition over inheritance and keep components focused on single responsibilities.</p>

      <h3>State Management</h3>
      <p>Choose the right state management solution based on your application's complexity. Redux, Zustand, and React Context each have their place.</p>

      <h3>Performance Optimization</h3>
      <p>Implement code splitting, lazy loading, and memoization to ensure your React app performs well at scale.</p>

      <h2>Conclusion</h2>
      <p>Following these best practices will help you build React applications that are maintainable, performant, and scalable.</p>
    `,
    excerpt: 'Learn essential best practices for building scalable React applications that grow with your business.',
    author: 'React Developer',
    category: 'Development',
    tags: ['React', 'JavaScript', 'Architecture', 'Performance'],
    image: '/images/articles/react-scalability.jpg',
    published: true,
    featured: false,
    readTime: '7 min',
    status: 'published'
  },
  {
    title: 'The Rise of Edge Computing: What Developers Need to Know',
    content: `
      <h2>What is Edge Computing?</h2>
      <p>Edge computing brings computation and data storage closer to the devices where it's being gathered, rather than relying on a central location that can be thousands of miles away.</p>

      <h2>Benefits for Developers</h2>

      <h3>Reduced Latency</h3>
      <p>By processing data closer to the source, edge computing significantly reduces latency, making applications feel more responsive.</p>

      <h3>Improved Security</h3>
      <p>Edge computing can improve security by keeping sensitive data local and reducing the attack surface.</p>

      <h3>Cost Efficiency</h3>
      <p>Edge computing can reduce bandwidth costs and improve overall application performance.</p>

      <h2>Implementation Strategies</h2>
      <p>Consider using CDNs, edge functions, and distributed databases to implement edge computing in your applications.</p>
    `,
    excerpt: 'Understanding edge computing and how it can improve your application performance and user experience.',
    author: 'System Architect',
    category: 'Infrastructure',
    tags: ['Edge Computing', 'Performance', 'Architecture', 'CDN'],
    image: '/images/articles/edge-computing.jpg',
    published: true,
    featured: false,
    readTime: '6 min',
    status: 'pending'
  },
  {
    title: 'Database Design Patterns for Modern Applications',
    content: `
      <h2>Introduction</h2>
      <p>Choosing the right database design pattern is crucial for building scalable and maintainable applications.</p>

      <h2>Common Patterns</h2>

      <h3>Repository Pattern</h3>
      <p>The repository pattern provides a unified interface for accessing data, making it easier to switch between different data sources.</p>

      <h3>Unit of Work</h3>
      <p>This pattern maintains a list of objects affected by a business transaction and coordinates writing out changes.</p>

      <h3>Active Record</h3>
      <p>Active Record objects carry both data and behavior, making them easy to understand and use.</p>

      <h2>Choosing the Right Pattern</h2>
      <p>Consider your application's complexity, team size, and future requirements when selecting a database pattern.</p>
    `,
    excerpt: 'Essential database design patterns every developer should know for building robust applications.',
    author: 'Database Engineer',
    category: 'Database',
    tags: ['Database', 'Design Patterns', 'Architecture', 'SQL'],
    image: '/images/articles/database-patterns.jpg',
    published: false,
    featured: false,
    readTime: '8 min',
    status: 'draft'
  },
  {
    title: 'Security Best Practices for Web Applications',
    content: `
      <h2>Why Security Matters</h2>
      <p>Web application security is more important than ever. A single vulnerability can compromise user data and damage your reputation.</p>

      <h2>Essential Security Measures</h2>

      <h3>Input Validation</h3>
      <p>Always validate and sanitize user input to prevent injection attacks and other security vulnerabilities.</p>

      <h3>Authentication & Authorization</h3>
      <p>Implement proper authentication and authorization mechanisms to control access to your application.</p>

      <h3>HTTPS Everywhere</h3>
      <p>Use HTTPS for all communications to encrypt data in transit and protect against man-in-the-middle attacks.</p>

      <h3>Regular Security Audits</h3>
      <p>Conduct regular security audits and penetration testing to identify and fix vulnerabilities.</p>

      <h2>Security Tools</h2>
      <p>Consider using security tools like OWASP ZAP, ESLint security plugins, and dependency scanners.</p>
    `,
    excerpt: 'Comprehensive security best practices to protect your web applications from common threats.',
    author: 'Security Specialist',
    category: 'Security',
    tags: ['Security', 'Web Development', 'Best Practices', 'HTTPS'],
    image: '/images/articles/web-security.jpg',
    published: true,
    featured: true,
    readTime: '9 min',
    status: 'approved'
  }
];

const sampleTeam = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    description: 'Sarah has over 15 years of experience in digital transformation and leads our strategic vision.',
    image: '/images/team/sarah.jpg',
    achievements: [
      'Led digital transformation for Fortune 500 companies',
      'Speaker at major tech conferences',
      'Published author on digital strategy',
      'Built teams from 5 to 500+ employees'
    ]
  },
  {
    name: 'Michael Chen',
    role: 'Technical Director',
    description: 'Michael oversees all technical aspects of our projects and ensures we use cutting-edge technologies.',
    image: '/images/team/michael.jpg',
    achievements: [
      'Full-stack architect with 12+ years experience',
      'Led development of 100+ web applications',
      'Open source contributor',
      'AWS certified solutions architect'
    ]
  },
  {
    name: 'Emma Rodriguez',
    role: 'Design Lead',
    description: 'Emma creates beautiful, user-centered designs that convert visitors into loyal customers.',
    image: '/images/team/emma.jpg',
    achievements: [
      'Award-winning UI/UX designer',
      'Led design for unicorn startups',
      'Published design system methodologies',
      'Mentored 50+ junior designers'
    ]
  },
  {
    name: 'David Kim',
    role: 'Senior Developer',
    description: 'David specializes in React, Node.js, and cloud architecture, building scalable solutions.',
    image: '/images/team/david.jpg',
    achievements: [
      'React and Node.js expert',
      'Built high-traffic applications',
      'Performance optimization specialist',
      'Open source maintainer'
    ]
  }
];

const sampleTestimonials = [
  {
    name: 'Jennifer Walsh',
    content: 'BM Agency transformed our online presence completely. The team was professional, responsive, and delivered exactly what we needed. Our website traffic increased by 300% in just 3 months.',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    image: '/images/testimonials/jennifer.jpg',
    rating: 5
  },
  {
    name: 'Robert Martinez',
    content: 'Working with BM Agency was a game-changer for our business. They not only built us a beautiful website but also helped us understand our customers better through data analytics.',
    role: 'CEO',
    company: 'GrowthCorp',
    image: '/images/testimonials/robert.jpg',
    rating: 5
  },
  {
    name: 'Lisa Thompson',
    content: 'The mobile app they built for us exceeded all expectations. The user experience is intuitive, and our customer engagement has improved significantly.',
    role: 'Product Manager',
    company: 'AppVenture',
    image: '/images/testimonials/lisa.jpg',
    rating: 5
  },
  {
    name: 'James Wilson',
    content: 'Professional, creative, and reliable. BM Agency delivered our e-commerce platform on time and within budget. Highly recommended!',
    role: 'Operations Director',
    company: 'RetailPlus',
    image: '/images/testimonials/james.jpg',
    rating: 5
  }
];

const sampleProducts = [
  {
    name: 'Web Development Package',
    description: 'Complete web development solution including design, development, and deployment. Perfect for small to medium businesses.',
    price: 2500,
    image: '/images/products/web-package.jpg',
    category: 'Web Development',
    stock: 10,
    featured: true
  },
  {
    name: 'Mobile App Development',
    description: 'Custom mobile application development for iOS and Android platforms with modern UI/UX design.',
    price: 3500,
    image: '/images/products/mobile-package.jpg',
    category: 'Mobile Development',
    stock: 5,
    featured: true
  },
  {
    name: 'UI/UX Design Package',
    description: 'Professional UI/UX design services including wireframes, prototypes, and design systems.',
    price: 1500,
    image: '/images/products/design-package.jpg',
    category: 'Design',
    stock: 8,
    featured: false
  },
  {
    name: 'Consulting Hours',
    description: 'Expert consulting services for technical architecture, code review, and project planning.',
    price: 150,
    image: '/images/products/consulting.jpg',
    category: 'Consulting',
    stock: 50,
    featured: false
  }
];

async function createSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bm-agency', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await Realisation.deleteMany({});
    await Article.deleteMany({});
    await Team.deleteMany({});
    await Testimonial.deleteMany({});
    await Product.deleteMany({});

    console.log('Cleared existing data');

    // Create sample services
    const services = await Service.insertMany(sampleServices);
    console.log(`Created ${services.length} sample services`);

    // Create sample realizations
    const realisations = await Realisation.insertMany(sampleRealisations);
    console.log(`Created ${realisations.length} sample realizations`);

    // Create sample articles
    const articles = await Article.insertMany(sampleArticles);
    console.log(`Created ${articles.length} sample articles`);

    // Create sample team members
    const team = await Team.insertMany(sampleTeam);
    console.log(`Created ${team.length} sample team members`);

    // Create sample testimonials
    const testimonials = await Testimonial.insertMany(sampleTestimonials);
    console.log(`Created ${testimonials.length} sample testimonials`);

    // Create sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} sample products`);

    console.log('\nSample data created successfully!');
    console.log('\nSummary:');
    console.log(`Services: ${services.length}`);
    console.log(`Realizations: ${realisations.length}`);
    console.log(`Articles: ${articles.length} (${articles.filter(a => a.published).length} published)`);
    console.log(`Team Members: ${team.length}`);
    console.log(`Testimonials: ${testimonials.length}`);
    console.log(`Products: ${products.length}`);

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

createSampleData();

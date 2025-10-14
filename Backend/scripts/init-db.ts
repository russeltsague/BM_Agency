import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User';
import { Article } from '../src/models/Article';
import { Service } from '../src/models/Service';
import { Realisation } from '../src/models/Realisation';
import Testimonial from '../src/models/Testimonial';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}

const initDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Create indexes
    await User.init();
    console.log('User indexes created');

    await Article.init();
    console.log('Article indexes created');

    await Service.init();
    console.log('Service indexes created');

    console.log('Realisation indexes created');

    await Testimonial.init();
    console.log('Testimonial indexes created');

    // Create default admin user if it doesn't exist
    const adminExists = await User.findOne({ email: ADMIN_EMAIL });

    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });

      await admin.save();
      console.log('Default admin user created');
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
      console.log('PLEASE CHANGE THESE CREDENTIALS AFTER FIRST LOGIN!');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample data
    await createSampleData();

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

const createSampleData = async () => {
  try {
    // Create sample services
    const services = [
      {
        title: 'Développement Web',
        description: 'Création de sites web modernes et responsives utilisant les dernières technologies. Nous réalisons des sites vitrines, e-commerce et applications web sur mesure.',
        image: 'https://picsum.photos/800/600?random=1',
        features: [
          'Design responsive et mobile-first',
          'Intégration CMS personnalisé',
          'Optimisation SEO technique',
          'Hébergement et maintenance',
        ],
        pricing: 'À partir de 1500€',
        duration: '2-6 semaines',
        icon: 'Smartphone'
      },
      {
        title: 'Marketing Digital',
        description: 'Stratégies digitales complètes pour augmenter votre visibilité en ligne et générer plus de leads qualifiés pour votre entreprise.',
        image: 'https://picsum.photos/800/600?random=2',
        features: [
          'Audit et stratégie digitale',
          'Référencement SEO/SEA',
          'Campagnes publicitaires',
          'Content marketing',
          'Analyse des performances'
        ],
        pricing: 'À partir de 800€/mois',
        duration: '3-12 mois',
        icon: 'Megaphone'
      },
      {
        title: 'Design Graphique',
        description: 'Création d\'identités visuelles uniques et mémorables pour votre marque. Logos, chartes graphiques et supports de communication.',
        image: 'https://picsum.photos/800/600?random=3',
        features: [
          'Création d\'identité visuelle',
          'Design de logos et branding',
          'Charte graphique complète',
          'Supports print et digital',
          'Guidelines de marque'
        ],
        pricing: 'À partir de 600€',
        duration: '1-3 semaines',
        icon: 'Palette'
      }
    ];

    for (const serviceData of services) {
      const existingService = await Service.findOne({ title: serviceData.title });
      if (!existingService) {
        const service = new Service(serviceData);
        await service.save();
        console.log(`Sample service created: ${serviceData.title}`);
      } else {
        console.log(`Service already exists: ${serviceData.title}`);
      }
    }

    // Create sample articles
    const articles = [
      {
        title: 'Les tendances du développement web en 2024',
        content: `Le développement web évolue constamment avec de nouvelles technologies et tendances.
        Cette année, nous assistons à plusieurs évolutions majeures qui façonnent l'avenir du web.

        Tout d'abord, l'adoption massive des Progressive Web Apps (PWA) continue de croître.
        Ces applications offrent une expérience utilisateur exceptionnelle en combinant le meilleur
        du web et du mobile. Elles permettent un chargement rapide, un fonctionnement hors ligne
        et une intégration poussée avec le système d'exploitation.

        Ensuite, l'intelligence artificielle s'invite de plus en plus dans les projets web.
        Que ce soit pour la génération de contenu, l'optimisation des performances ou
        l'amélioration de l'expérience utilisateur, l'IA devient un outil indispensable.

        Les frameworks modernes comme React 18, Next.js 14 et Vue 3 offrent des performances
        accrues et de nouvelles fonctionnalités. L'accent est mis sur l'hydratation partielle,
        le streaming SSR et l'optimisation des images.

        Enfin, la sécurité reste une priorité absolue avec l'adoption généralisée de HTTPS,
        la protection contre les attaques CSRF et XSS, et l'implémentation de politiques
        de sécurité du contenu strictes.`,
        excerpt: 'Découvrez les principales tendances qui façonnent le développement web moderne en 2024.',
        category: 'Développement',
        tags: ['tendance', 'développement', 'web', '2024'],
        image: 'https://picsum.photos/800/400?random=4',
        published: true,
        featured: true,
        readTime: '5 min de lecture'
      },
      {
        title: 'Optimiser les performances de votre site e-commerce',
        content: `L'optimisation des performances est cruciale pour le succès d'un site e-commerce.
        Voici les stratégies essentielles pour améliorer la vitesse et l'expérience utilisateur.

        La première étape consiste à optimiser les images. Utilisez des formats modernes comme WebP,
        compressez vos images sans perte de qualité significative, et implémentez le lazy loading
        pour ne charger les images qu'au moment où elles entrent dans le viewport.

        Le cache joue également un rôle primordial. Configurez un cache navigateur efficace,
        utilisez un CDN pour distribuer votre contenu statique, et mettez en place un système
        de cache côté serveur pour les données fréquemment consultées.

        L'optimisation du JavaScript et du CSS est tout aussi importante. Minifiez vos fichiers,
        supprimez le code mort, et utilisez des techniques de code splitting pour ne charger
        que le code nécessaire à chaque page.

        Enfin, n'oubliez pas l'optimisation mobile. Votre site doit être parfaitement responsive,
        utiliser AMP pour les pages produits, et offrir une expérience fluide sur tous les appareils.`,
        excerpt: 'Découvrez comment améliorer les performances de votre site e-commerce et augmenter vos conversions.',
        category: 'E-commerce',
        tags: ['performance', 'e-commerce', 'optimisation', 'conversion'],
        image: 'https://picsum.photos/800/400?random=5',
        published: true,
        featured: false,
        readTime: '7 min de lecture'
      }
    ];

    for (const articleData of articles) {
      const existingArticle = await Article.findOne({ title: articleData.title });
      if (!existingArticle) {
        // Get the admin user as author
        const adminUser = await User.findOne({ email: ADMIN_EMAIL });
        if (adminUser) {
          const article = new Article({
            ...articleData,
            author: adminUser._id
          });
          await article.save();
          console.log(`Sample article created: ${articleData.title}`);
        }
      } else {
        console.log(`Article already exists: ${articleData.title}`);
      }
    }

    // Create sample realisations
    const realisations = [
      {
        title: 'Site e-commerce pour Maison du Café',
        description: 'Création d\'une plateforme e-commerce moderne pour une entreprise de torréfaction artisanale. Le site met en valeur les produits premium et offre une expérience d\'achat fluide avec système de livraison intégré.',
        image: 'https://picsum.photos/800/600?random=6',
        client: 'Maison du Café',
        date: new Date('2024-01-15'),
        category: 'E-commerce',
        tags: ['react', 'stripe', 'responsive', 'e-commerce'],
        link: 'https://maisonducafe-demo.com',
        featured: true
      },
      {
        title: 'Application mobile pour Food Delivery Co',
        description: 'Développement d\'une application mobile native pour une entreprise de livraison de repas. Interface intuitive, géolocalisation en temps réel, système de notation et suivi des commandes.',
        image: 'https://picsum.photos/800/600?random=7',
        client: 'Food Delivery Co',
        date: new Date('2023-11-20'),
        category: 'Application Mobile',
        tags: ['react-native', 'nodejs', 'mongodb', 'geolocation'],
        link: 'https://fooddelivery-app.com',
        featured: true
      },
      {
        title: 'Refonte du site corporate pour TechCorp',
        description: 'Refonte complète du site web corporate avec intégration d\'un système de gestion de contenu personnalisé, optimisation SEO et amélioration de l\'expérience utilisateur.',
        image: 'https://picsum.photos/800/600?random=8',
        client: 'TechCorp Industries',
        date: new Date('2023-09-10'),
        category: 'Site Web',
        tags: ['nextjs', 'cms', 'seo', 'responsive'],
        link: 'https://techcorp-corporate.com',
        featured: false
      }
    ];

    for (const realisationData of realisations) {
      const existingRealisation = await Realisation.findOne({ title: realisationData.title });
      if (!existingRealisation) {
        const realisation = new Realisation(realisationData);
        await realisation.save();
        console.log(`Sample realisation created: ${realisationData.title}`);
      } else {
        console.log(`Realisation already exists: ${realisationData.title}`);
      }
    }

    // Create sample testimonials
    const testimonials = [
      {
        name: 'Jean-Pierre Ndiaye',
        content: 'BM Agency a transformé notre présence digitale de manière exceptionnelle. Leur expertise technique et leur compréhension de nos besoins ont dépassé nos attentes.',
        company: 'Société Générale Cameroun',
        role: 'Directeur Marketing',
        rating: 5,
        image: 'https://picsum.photos/200/200?random=10'
      },
      {
        name: 'Marie-Claire Eboumbou',
        content: 'Travailler avec BM Agency a été une expérience formidable. Ils ont livré un site web moderne et fonctionnel dans les délais impartis, avec une attention particulière aux détails.',
        company: 'Orange Cameroun',
        role: 'Chef de Projet Digital',
        rating: 5,
        image: 'https://picsum.photos/200/200?random=11'
      },
      {
        name: 'Pierre Mvogo',
        content: 'L\'équipe de BM Agency est professionnelle et créative. Ils ont su traduire notre vision en une identité visuelle forte qui représente parfaitement notre marque.',
        company: 'MTN Cameroon',
        role: 'Directeur Communication',
        rating: 4,
        image: 'https://picsum.photos/200/200?random=12'
      }
    ];

    for (const testimonialData of testimonials) {
      const existingTestimonial = await Testimonial.findOne({ name: testimonialData.name });
      if (!existingTestimonial) {
        const testimonial = new Testimonial(testimonialData);
        await testimonial.save();
        console.log(`Sample testimonial created: ${testimonialData.name}`);
      } else {
        console.log(`Testimonial already exists: ${testimonialData.name}`);
      }
    }
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};

initDB();

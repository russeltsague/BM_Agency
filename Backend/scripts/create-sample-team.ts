import connectDB from '../src/config/database';
import { Team } from '../src/models/Team';

const sampleTeamMembers = [
  {
    name: 'Jean Dupont',
    role: 'CEO & Fondateur',
    description: 'Expert en stratégie digitale avec plus de 15 ans d\'expérience dans le développement web et le marketing digital.',
    image: '/images/team/jean-dupont.jpg',
    achievements: [
      'Plus de 100 projets livrés avec succès',
      'Expert certifié en Marketing Digital',
      'Conférencier international'
    ]
  },
  {
    name: 'Marie Laurent',
    role: 'Directrice Artistique',
    description: 'Designer graphique passionnée avec un œil pour les détails et une expertise en identité de marque.',
    image: '/images/team/marie-laurent.jpg',
    achievements: [
      'Plus de 50 identités de marque créées',
      'Spécialiste en expérience utilisateur',
      'Formation en design d\'interface avancé'
    ]
  },
  {
    name: 'Thomas Martin',
    role: 'Développeur Full-Stack',
    description: 'Développeur passionné par les dernières technologies web et les solutions innovantes.',
    image: '/images/team/thomas-martin.jpg',
    achievements: [
      'Expert en React et Node.js',
      'Certification en sécurité informatique',
      'Contributeur open-source actif'
    ]
  },
  {
    name: 'Sophie Bernard',
    role: 'Responsable Marketing',
    description: 'Spécialiste du marketing digital avec une expertise en stratégie de contenu et référencement.',
    image: '/images/team/sophie-bernard.jpg',
    achievements: [
      'Plus de 8 ans d\'expérience en SEO',
      'Formation en Growth Hacking',
      'Conférencière en marketing digital'
    ]
  },
  {
    name: 'David Petit',
    role: 'Développeur Mobile',
    description: 'Développeur mobile expérimenté avec une passion pour les applications innovantes et conviviales.',
    image: '/images/team/david-petit.jpg',
    achievements: [
      'Expert en React Native et Flutter',
      'Plus de 20 applications publiées',
      'Spécialiste en performance mobile'
    ]
  }
];

async function createSampleTeam() {
  try {
    console.log('Tentative de connexion à la base de données...');
    
    // Se connecter à la base de données avec un timeout
    const timeout = 30000; // 30 secondes de timeout
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connexion à la base de données expirée')), timeout)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ Connecté à la base de données avec succès');
    
    // Supprimer les membres d'équipe existants
    console.log('Suppression des anciens membres d\'équipe...');
    const deleteResult = await Team.deleteMany({});
    console.log(`✅ ${deleteResult.deletedCount} anciens membres d'équipe supprimés`);
    
    // Créer les nouveaux membres d'équipe
    console.log('Création des nouveaux membres d\'équipe...');
    const createdTeam = await Team.insertMany(sampleTeamMembers);
    console.log(`✅ ${createdTeam.length} membres d'équipe créés avec succès !`);
    
    // Afficher un aperçu des membres créés
    console.log('\nAperçu des membres créés :');
    createdTeam.forEach(member => {
      console.log(`- ${member.name} (${member.role})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des membres d\'équipe :');
    
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error('Erreur inconnue:', error);
    }
    
    // Vérifier la connexion à la base de données
    console.log('\nVérification de la connexion à la base de données...');
    console.log('URI de connexion:', process.env.MONGO_URI ? 'Définie' : 'Non définie');
    
    process.exit(1);
  }
}

createSampleTeam();

import { emailService } from './src/utils/emailService';
import { User } from './src/models/User';

// Test script pour vérifier le service email
async function testEmailService() {
  try {
    console.log('🧪 Test du service email...');

    // Créer un utilisateur de test (mock)
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
      role: 'content_writer'
    } as any;

    // Test d'envoi d'email de bienvenue
    console.log('📧 Test: Envoi d\'email de bienvenue...');
    await emailService.sendWelcomeNotification(mockUser, 'testpassword123');
    console.log('✅ Email de bienvenue envoyé avec succès');

    console.log('🎉 Tous les tests email ont réussi!');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('\n💡 Vérifiez votre configuration:');
    console.log('- Les variables d\'environnement SMTP sont-elles définies?');
    console.log('- Le serveur SMTP est-il accessible?');
    console.log('- Consultez .env.example.email pour la configuration');
  }
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testEmailService();
}

export { testEmailService };

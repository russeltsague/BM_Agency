import nodemailer from 'nodemailer';
import { IUser } from '../models/User';
import { Notification } from '../models/Notification';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"BM Agency" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }

  async sendArticleSubmissionNotification(author: IUser, articleTitle: string, articleId: string): Promise<void> {
    const subject = 'Nouvel article soumis pour approbation';
    const html = `
      <h2>Nouvel article soumis</h2>
      <p>Bonjour,</p>
      <p><strong>${author.name}</strong> a soumis un nouvel article pour approbation:</p>
      <p><strong>Titre:</strong> ${articleTitle}</p>
      <p>Veuillez vous connecter à votre tableau de bord pour examiner et approuver cet article.</p>
      <a href="${process.env.FRONTEND_URL}/admin/articles/${articleId}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Examiner l'article</a>
      <p>Cordialement,<br>L'équipe BM Agency</p>
    `;

    // Send to all super admins and admins
    const adminUsers = await require('../models/User').User.find({
      role: { $in: ['super_admin', 'admin'] },
      isActive: true
    });

    for (const admin of adminUsers) {
      if (admin.email !== author.email) {
        await this.sendEmail({
          to: admin.email,
          subject,
          html
        });

        // Save notification to database
        await Notification.create({
          recipient: admin._id,
          type: 'article_submitted',
          title: subject,
          message: `L'auteur ${author.name} a soumis l'article "${articleTitle}" pour approbation`,
          data: { articleId, articleTitle, authorId: author._id }
        });
      }
    }
  }

  async sendArticleApprovalNotification(author: IUser, articleTitle: string, articleId: string): Promise<void> {
    const subject = 'Article approuvé et publié';
    const html = `
      <h2>Article approuvé</h2>
      <p>Bonjour ${author.name},</p>
      <p>Nous sommes heureux de vous informer que votre article "<strong>${articleTitle}</strong>" a été approuvé et publié avec succès.</p>
      <a href="${process.env.FRONTEND_URL}/blog/${articleId}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Voir l'article publié</a>
      <p>Merci pour votre contribution!</p>
      <p>Cordialement,<br>L'équipe BM Agency</p>
    `;

    await this.sendEmail({
      to: author.email,
      subject,
      html
    });

    // Save notification to database
    await Notification.create({
      recipient: author._id,
      type: 'article_approved',
      title: subject,
      message: `Votre article "${articleTitle}" a été approuvé et publié`,
      data: { articleId, articleTitle }
    });
  }

  async sendArticleRejectionNotification(author: IUser, articleTitle: string, articleId: string, reason: string): Promise<void> {
    const subject = 'Article refusé';
    const html = `
      <h2>Article refusé</h2>
      <p>Bonjour ${author.name},</p>
      <p>Nous regrettons de vous informer que votre article "<strong>${articleTitle}</strong>" n'a pas été approuvé.</p>
      <p><strong>Raison:</strong> ${reason}</p>
      <p>Vous pouvez modifier votre article et le soumettre à nouveau pour approbation.</p>
      <a href="${process.env.FRONTEND_URL}/admin/articles/${articleId}/edit" style="background-color: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Modifier l'article</a>
      <p>Cordialement,<br>L'équipe BM Agency</p>
    `;

    await this.sendEmail({
      to: author.email,
      subject,
      html
    });

    // Save notification to database
    await Notification.create({
      recipient: author._id,
      type: 'article_rejected',
      title: subject,
      message: `Votre article "${articleTitle}" a été refusé. Raison: ${reason}`,
      data: { articleId, articleTitle, reason }
    });
  }

  async sendRoleAssignmentNotification(user: IUser, newRole: string, assignedBy: IUser): Promise<void> {
    const subject = 'Attribution d\'un nouveau rôle';
    const html = `
      <h2>Nouveau rôle attribué</h2>
      <p>Bonjour ${user.name},</p>
      <p>Votre rôle a été modifié par <strong>${assignedBy.name}</strong>.</p>
      <p><strong>Nouveau rôle:</strong> ${newRole}</p>
      <p>Vous pouvez maintenant accéder aux fonctionnalités correspondant à votre nouveau rôle.</p>
      <a href="${process.env.FRONTEND_URL}/admin" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accéder au tableau de bord</a>
      <p>Cordialement,<br>L'équipe BM Agency</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject,
      html
    });

    // Save notification to database
    await Notification.create({
      recipient: user._id,
      type: 'role_assigned',
      title: subject,
      message: `Votre rôle a été changé en ${newRole} par ${assignedBy.name}`,
      data: { newRole, assignedById: assignedBy._id }
    });
  }

  async sendWelcomeNotification(user: IUser, tempPassword?: string): Promise<void> {
    const subject = 'Bienvenue sur BM Agency';
    const html = `
      <h2>Bienvenue ${user.name}!</h2>
      <p>Votre compte a été créé avec succès.</p>
      <p><strong>Votre rôle:</strong> ${user.roles.join(', ')}</p>
      ${tempPassword ? `<p><strong>Mot de passe temporaire:</strong> ${tempPassword}</p><p>Veuillez le changer lors de votre première connexion.</p>` : ''}
      <a href="${process.env.FRONTEND_URL}/login" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Se connecter</a>
      <p>Cordialement,<br>L'équipe BM Agency</p>
    `;

    await this.sendEmail({
      to: user.email,
      subject,
      html
    });

    // Save notification to database
    await Notification.create({
      recipient: user._id,
      type: 'welcome',
      title: subject,
      message: `Bienvenue sur BM Agency! Votre compte ${user.roles.join(', ')} a été créé.`,
      data: { roles: user.roles }
    });
  }
}

export const emailService = new EmailService();

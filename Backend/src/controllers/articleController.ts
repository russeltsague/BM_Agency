import { Request, Response } from 'express';
import { Article, ArticleStatus } from '../models/Article';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { logAction } from '../utils/logAction';
import { sendLiveNotification, sendLiveNotificationToMultiple } from '../utils/socketUtils';
import { emailService } from '../utils/emailService';

// Get all articles
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const { status, category, author, featured, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (author) filter.author = author;
    if (featured === 'true') filter.featured = true;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const articles = await Article.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Article.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: articles.length,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      },
      data: articles
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get articles' });
  }
};

// Get articles by author
export const getArticlesByAuthor = async (req: Request, res: Response) => {
  try {
    const { author } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate MongoDB ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(author)) {
      // Return empty result for invalid IDs instead of error
      return res.status(200).json({
        status: 'success',
        results: 0,
        pagination: {
          current: Number(page),
          pages: 0,
          total: 0
        },
        data: []
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const articles = await Article.find({ author })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Article.countDocuments({ author });

    res.status(200).json({
      status: 'success',
      results: articles.length,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      },
      data: articles
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get articles by author' });
  }
};

// Get article by ID
export const getArticleById = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ status: 'fail', message: 'Article not found' });
    }
    res.status(200).json({ status: 'success', data: article });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get article' });
  }
};

// Create a new article (draft by default)
export const createArticle = async (req: Request, res: Response) => {
  try {
    // Add the authenticated user as the author
    const articleData = {
      ...req.body,
      author: req.user?.id, // Use the authenticated user's ID
      status: ArticleStatus.DRAFT,
      published: false
    };

    const newArticle = await Article.create(articleData);
    res.status(201).json({ status: 'success', data: { article: newArticle } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create article' });
  }
};

// Submit article for approval
export const submitForApproval = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ status: 'fail', message: 'Article not found' });
    }

    // Check if user is the author or has permission to submit
    if (article.author.toString() !== req.user?.id && !req.user?.hasPermission('manage_all_content')) {
      return res.status(403).json({ status: 'fail', message: 'You can only submit your own articles for approval' });
    }

    // Update article status
    article.status = ArticleStatus.SUBMITTED_FOR_REVIEW;
    article.submittedAt = new Date();
    article.history.push({
      action: 'submitted_for_review',
      by: req.user.id.toString(),
      note: 'Article submitted for review'
    });
    await article.save();

    // Get owners and admins for notifications
    const adminsAndOwners = await User.find({
      roles: { $in: ['admin', 'owner'] },
      isActive: true
    });

    // Create notifications for admins/owners
    const notifications = adminsAndOwners.map(admin => ({
      user: admin._id,
      type: 'article_submitted',
      message: `${req.user.name} submitted "${article.title}" for review.`,
      data: {
        articleId: article._id.toString(),
        articleTitle: article.title,
        submitter: req.user.name
      }
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);

      // Send real-time notifications
      const io = req.app.get('io');
      const onlineUsers = (global as any).onlineUsers;

      adminsAndOwners.forEach(admin => {
        const notification = {
          type: 'article_submitted',
          message: `${req.user.name} submitted "${article.title}" for review.`,
          data: {
            articleId: article._id.toString(),
            articleTitle: article.title,
            submitter: req.user.name
          }
        };
        sendLiveNotification(io, onlineUsers, admin._id.toString(), notification);

        // Send email notifications
        emailService.sendArticleSubmissionNotification(admin, req.user.name, article.title, article._id.toString());
      });
    }

    // Log the action
    await logAction('Article', article._id.toString(), 'submit', req.user.id);

    res.status(200).json({ status: 'success', data: article });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to submit article for approval' });
  }
};

// Approve article (admin/super admin only)
export const approveArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ status: 'fail', message: 'Article not found' });
    }

    // Check if user has approval permission
    if (!req.user?.hasPermission('approve_content')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to approve articles' });
    }

    // Update article status
    article.status = ArticleStatus.APPROVED;
    article.approvedAt = new Date();
    article.history.push({
      action: 'approved',
      by: req.user.id.toString(),
      note: 'Article approved for publication'
    });
    await article.save();

    // Get the author
    const author = await User.findById(article.author);

    if (author) {
      // Create notification for author
      await Notification.create({
        user: author._id,
        type: 'article_approved',
        message: `Your article "${article.title}" has been approved.`,
        data: {
          articleId: article._id.toString(),
          articleTitle: article.title,
          approver: req.user.name
        }
      });

      // Send real-time notification to author
      const io = req.app.get('io');
      const onlineUsers = (global as any).onlineUsers;
      const notification = {
        type: 'article_approved',
        message: `Your article "${article.title}" has been approved.`,
        data: {
          articleId: article._id.toString(),
          articleTitle: article.title,
          approver: req.user.name
        }
      };
      sendLiveNotification(io, onlineUsers, author._id.toString(), notification);

      // Send email notification
      emailService.sendArticleApprovalNotification(author, article.title, article._id.toString());
    }

    // Log the action
    await logAction('Article', article._id.toString(), 'approve', req.user.id);

    res.status(200).json({ status: 'success', data: article });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to approve article' });
  }
};

// Reject article (admin/super admin only)
export const rejectArticle = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ status: 'fail', message: 'Article not found' });
    }

    // Check if user has approval permission
    if (!req.user?.hasPermission('approve_content')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to reject articles' });
    }

    // Update article status back to draft with rejection reason
    article.status = ArticleStatus.DRAFT;
    article.history.push({
      action: 'rejected',
      by: req.user.id.toString(),
      note: `Article rejected: ${reason || 'No reason provided'}`
    });
    await article.save();

    // Get the author
    const author = await User.findById(article.author);

    if (author) {
      // Create notification for author
      await Notification.create({
        user: author._id,
        type: 'article_rejected',
        message: `Your article "${article.title}" has been rejected.`,
        data: {
          articleId: article._id.toString(),
          articleTitle: article.title,
          reason: reason || 'No reason provided',
          reviewer: req.user.name
        }
      });

      // Send real-time notification to author
      const io = req.app.get('io');
      const onlineUsers = (global as any).onlineUsers;
      const notification = {
        type: 'article_rejected',
        message: `Your article "${article.title}" has been rejected.`,
        data: {
          articleId: article._id.toString(),
          articleTitle: article.title,
          reason: reason || 'No reason provided',
          reviewer: req.user.name
        }
      };
      sendLiveNotification(io, onlineUsers, author._id.toString(), notification);

      // Send email notification
      emailService.sendArticleRejectionNotification(author, article.title, article._id.toString(), reason || 'No reason provided');
    }

    // Log the action
    await logAction('Article', article._id.toString(), 'reject', req.user.id);

    res.status(200).json({ status: 'success', data: article });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to reject article' });
  }
};

// Get articles pending approval (admin/super admin only)
export const getPendingArticles = async (req: Request, res: Response) => {
  try {
    // Check if user has approval permission
    if (!req.user?.hasPermission('approve_content')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to view pending articles' });
    }

    const pendingArticles = await Article.find({ status: ArticleStatus.PENDING_APPROVAL })
      .populate('author', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({ status: 'success', results: pendingArticles.length, data: pendingArticles });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get pending articles' });
  }
};

// Update an article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ status: 'fail', message: 'Article not found' });
    }

    // Check permissions
    if (article.author.toString() !== req.user?.id && !req.user?.hasPermission('edit_others_content')) {
      return res.status(403).json({ status: 'fail', message: 'You can only edit your own articles' });
    }

    // If article is already published, only admins can edit
    if (article.status === ArticleStatus.PUBLISHED && !req.user?.hasPermission('manage_all_content')) {
      return res.status(403).json({ status: 'fail', message: 'Only administrators can edit published articles' });
    }

    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: updatedArticle });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update article' });
  }
};

// Publish article (admin/owner only)
export const publishArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ status: 'fail', message: 'Article not found' });
    }

    // Check if user has publish permission
    if (!req.user?.roles.includes('admin') && !req.user?.roles.includes('owner')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to publish articles' });
    }

    // Check if article is approved
    if (article.status !== ArticleStatus.APPROVED) {
      return res.status(400).json({
        status: 'fail',
        message: `Article must be approved before publishing. Current status: ${article.status}`
      });
    }

    // Update article status
    article.status = ArticleStatus.PUBLISHED;
    article.published = true;
    article.publishedAt = new Date();
    article.history.push({
      action: 'published',
      by: req.user.id.toString(),
      note: 'Article published'
    });
    await article.save();

    // Get the author
    const author = await User.findById(article.author);

    if (author) {
      // Create notification for author
      await Notification.create({
        user: author._id,
        type: 'article_published',
        message: `Your article "${article.title}" has been published.`,
        data: {
          articleId: article._id.toString(),
          articleTitle: article.title,
          publisher: req.user.name
        }
      });

      // Send real-time notification to author
      const io = req.app.get('io');
      const onlineUsers = (global as any).onlineUsers;
      const notification = {
        type: 'article_published',
        message: `Your article "${article.title}" has been published.`,
        data: {
          articleId: article._id.toString(),
          articleTitle: article.title,
          publisher: req.user.name
        }
      };
      sendLiveNotification(io, onlineUsers, author._id.toString(), notification);

      // Send email notification
      emailService.sendArticlePublicationEmail(author, article.title, article._id.toString());
    }

    // Log the action
    await logAction('Article', article._id.toString(), 'publish', req.user.id);

    res.status(200).json({ status: 'success', data: article });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to publish article' });
  }
};

// Delete an article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);

    // Check permissions
    if (article.author.toString() !== req.user?.id && !req.user?.hasPermission('delete_content')) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to delete this article' });
    }

    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete article' });
  }
};

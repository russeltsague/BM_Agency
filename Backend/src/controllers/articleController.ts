import { Request, Response } from 'express';
import { Article } from '../models/Article';

// Get all articles
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find();
    res.status(200).json({ status: 'success', results: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get articles' });
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

// Create a new article
export const createArticle = async (req: Request, res: Response) => {
  try {
    // Add the authenticated user as the author
    const articleData = {
      ...req.body,
      author: req.user?.id // Use the authenticated user's ID
    };

    const newArticle = await Article.create(articleData);
    res.status(201).json({ status: 'success', data: { article: newArticle } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create article' });
  }
};

// Update an article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedArticle) {
      return res.status(404).json({ status: 'fail', message: 'Article not found' });
    }
    res.status(200).json({ status: 'success', data: updatedArticle });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update article' });
  }
};

// Delete an article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ status: 'fail', message: 'Article not found' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete article' });
  }
};

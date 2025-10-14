import { Request, Response } from 'express';
import { Team } from '../models/Team';

// Get all team members
export const getAllTeamMembers = async (req: Request, res: Response) => {
  try {
    const teamMembers = await Team.find();
    res.status(200).json({ status: 'success', results: teamMembers.length, data: teamMembers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get team members' });
  }
};

// Get team member by ID
export const getTeamMemberById = async (req: Request, res: Response) => {
  try {
    const teamMember = await Team.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ status: 'fail', message: 'Team member not found' });
    }
    res.status(200).json({ status: 'success', data: teamMember });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to get team member' });
  }
};

// Create a new team member
export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const newTeamMember = await Team.create(req.body);
    res.status(201).json({ status: 'success', data: newTeamMember });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create team member' });
  }
};

// Update a team member
export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const updatedTeamMember = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTeamMember) {
      return res.status(404).json({ status: 'fail', message: 'Team member not found' });
    }
    res.status(200).json({ status: 'success', data: updatedTeamMember });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update team member' });
  }
};

// Delete a team member
export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const deletedTeamMember = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeamMember) {
      return res.status(404).json({ status: 'fail', message: 'Team member not found' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete team member' });
  }
};

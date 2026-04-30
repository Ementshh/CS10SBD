const UserService = require('../services/user.service');
const { AppError } = require('../middleware/errorHandler');
const redisClient = require('../database/redis');
const User = require('../models/user.model');


class UserController {

  static async getUserByEmail(req, res, next) {

    try {

      const { email } = req.params;
      const key = `user:${email}`;
      const cached = await redisClient.get(key);

      if (cached) {
        return res.status(200).json({
          success: true,
          message: 'Returned from cache',
          data: JSON.parse(cached),
        });
      }

      const userEmail = await UserController.getUserEmail(email);
      await redisClient.set(key, JSON.stringify(userEmail), 'EX', 60);

      res.status(200).json({
        success: true,
        message: 'Returned not from cache',
        data: userEmail,
      });

    } catch (error) {
      next(error);
    }
  }

  static async getUserEmail(email) {
    const userEmail = await User.findByEmail(email);
    return userEmail;
  }

  static async register(req, res, next) {
    try {
      const { name, username, email, phone, password } = req.body;
      const user = await UserService.register({ name, username, email, phone, password });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, user } = await UserService.login(email, password);
      // Return only user data (no token) for /user/login
      res.status(200).json({
        success: true,
        message: 'Login successful',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { id, name, username, email, phone, password, balance } = req.body;
      const updatedUser = await UserService.updateProfile(id, { name, username, email, phone, password, balance });

      // INI NOMOR 3
      if (updatedUser && updatedUser.email) {
        const key = `user:${updatedUser.email}`;
        await redisClient.del(key);
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const history = await UserService.getTransactionHistory(userId);
      res.status(200).json({
        success: true,
        message: 'Transaction history retrieved',
        payload: history,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTotalSpent(req, res, next) {
    try {
      const userId = req.user.userId;
      const totalSpent = await UserService.getTotalSpent(userId);
      res.status(200).json({
        success: true,
        message: 'Total spent retrieved',
        payload: { total_spent: totalSpent },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
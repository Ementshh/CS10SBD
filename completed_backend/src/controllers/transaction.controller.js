const TransactionService = require('../services/transaction.service');
const redisClient = require('../database/redis');

class TransactionController {
  static async createTransaction(req, res, next) {
    try {
      const { user_id, item_id, quantity, description } = req.body;
      const transaction = await TransactionService.createTransaction({ user_id, item_id, quantity, description });

      const messageId = await redisClient.xadd(
        'transaction-logs',
        '*',
        'userId', user_id.toString(),
        'itemId', item_id.toString(),
        'total', transaction.total.toString()
      );
      console.log(`[Redis Stream] Pesan dengan ID ${messageId} berhasil masuk ke STREAM transaction-logs`);

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        payload: {
          ...transaction,
          redis_message_id: messageId
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await TransactionService.getTransactionById(id);
      res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        payload: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  static async payTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const result = await TransactionService.payTransaction(id, userId);
      res.status(200).json({
        success: true,
        message: 'Payment successful',
        payload: {
          transaction_id: result.transactionId,
          new_balance: result.newBalance,
          status: 'paid',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTransaction(req, res, next) {
    try {
      const { id } = req.params;
      await TransactionService.deleteTransaction(id);
      res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
        payload: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;
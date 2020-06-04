import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transactionrepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(Transactionrepository);
    const transaction = await transactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction dos not exist');
    }

    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;

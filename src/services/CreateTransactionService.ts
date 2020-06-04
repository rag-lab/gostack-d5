import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionReposiroty from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionReposiroty);
    const categoryRepository = getRepository(Category);

    // nao passa se nao tiver saldo para a retirada no valor desejadop
    const { total } = await transactionRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('Sem saldo patrão');
    }

    // busca categoria
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    // nao achou categoria, inclui nova categoria e retorna obleto criado
    if (!transactionCategory) {
      transactionCategory = await categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(transactionCategory);
    }

    // cria obj transaction
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory, // detalhe que aqui passa o objeto interio
    });
    // salva transaction
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

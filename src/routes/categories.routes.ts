import { Router } from 'express';
import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRouter = Router();

categoriesRouter.post('/', async (request, response) => {
  // TODO

  try {
    const { title } = request.body;
    const createCategory = new CreateCategoryService();

    const category = await createCategory.execute({
      title,
    });

    return response.json(category);
  } catch (err) {
    return response.status(400).json({ error: err.messager });
  }
});

export default categoriesRouter;

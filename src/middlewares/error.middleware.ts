import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // 1. Erros customizados da aplicação (AppError, NotFoundError, BadRequestError, etc.)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
      ...(error.details ? { errors: error.details } : {}),
    });
    return;
  }

  // 2. Erros de validação do Zod (400 Bad Request)
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Falha na validação dos dados de entrada.',
      errors: formattedErrors,
    });
    return;
  }

  // 3. Erro de JSON mal formatado no body da requisição (400 Bad Request)
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'JSON mal formatado no corpo da requisição.',
    });
    return;
  }

  // 4. Erros conhecidos do Prisma ORM
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Violação de restrição única (ex: e-mail ou nome repetido)
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[])?.join(', ') || 'campo';
      res.status(409).json({
        status: 'error',
        statusCode: 409,
        message: `Já existe um registro com este valor único (${target}).`,
      });
      return;
    }

    // P2025: Registro não encontrado para atualização/deleção
    if (error.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Registro não encontrado no banco de dados.',
      });
      return;
    }

    // P2003: Chave estrangeira inválida
    if (error.code === 'P2003') {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Chave estrangeira inválida ou entidade relacionada não existe.',
      });
      return;
    }

    // P2023: Valor incompatível com tipo da coluna
    if (error.code === 'P2023') {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Identificador ou parâmetro inválido.',
      });
      return;
    }
  }

  // 5. Log do erro não tratado no servidor e retorno 500
  console.error('❌ Erro não tratado na aplicação:', error);

  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: process.env.NODE_ENV === 'production' 
      ? 'Ocorreu um erro interno no servidor.' 
      : error.message || 'Erro interno do servidor',
  });
};

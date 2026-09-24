export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado.') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requisição inválida.', details?: unknown) {
    super(message, 400, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito com recurso existente.') {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Falha na validação dos dados de entrada.', details?: unknown) {
    super(message, 400, details);
  }
}

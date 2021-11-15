import { createMiddleware } from './server';
import { MiddlewareConfig } from './types';
export const createExpressMiddleware = (config: MiddlewareConfig) => createMiddleware(config);

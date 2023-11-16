import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const fullmsg = err.errors.reduce((fullmsg , msg) => {
          fullmsg.message += ` ${msg.message}`;
          return fullmsg;
        }) 
        return res.status(400).json({
          message: fullmsg.message
        });
      }
      next(err);
    }
  };


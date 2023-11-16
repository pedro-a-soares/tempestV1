import { object, string, TypeOf } from 'zod';

export const createContactSchema = object({
  body: object({
    contact: string({ required_error: 'contact is required' }),
  })
});

export type CreateContactInput = TypeOf<typeof createContactSchema>['body'];


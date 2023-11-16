import { object, string, TypeOf } from 'zod';

export const sendMessageSchema = object({
  body: object({
    contact: string({ required_error: 'contact is required' }),
    message: string({ required_error: 'message is required' })
    .min(1, 'message cant be empty')
    .max(128, 'who needs messages longer than tweets')
  })
});

export const getMessagesSchema = object({
  body: object({
    contact: string({ required_error: 'contact is required' })
  })
});

export type SendMessageInput = TypeOf<typeof sendMessageSchema>['body'];
export type getMessagesInput = TypeOf<typeof getMessagesSchema>['body'];



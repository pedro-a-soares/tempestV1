import { object, string, TypeOf, z } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({ required_error: 'Name is required' }),
    handle: string({ required_error: 'Handle is required' })
    .min(3, 'Handle must be more than 3 characters long')
    .max(8, 'Handle must be less than 8 characters long'),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
  })
});

export const loginUserSchema = object({
  body: object({
    handle: string({ required_error: 'Handle is required' }),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid Handle or password'
    ),
  }),
});


export const updateUserProfileSchema = object({
  body: object({
    gender: string({ required_error: 'gender is required' }),
    handle: string({ required_error: 'Handle is required' })
    .min(3, 'Handle must be more than 3 characters long')
    .max(8, 'Handle must be less than 8 characters long'),
    country: string({ required_error: 'country is required' }),
    avatar: string({ required_error: 'avatar is required' })
  })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
export type UpdateUserProfileInput = TypeOf<typeof updateUserProfileSchema>['body']

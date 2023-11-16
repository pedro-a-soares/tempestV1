import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import { createUser, findUser, signToken } from '../services/user.service';
import AppError from '../utils/appError';

// Exclude this fields from the response
export const excludedFields = ['password'];

export const revokedTokens: string[] = []

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
};

// Only set secure to true in production
if (process.env.NODE_ENV === 'production')
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser({
      handle: req.body.handle,
      name: req.body.name,
      password: req.body.password,
    });
    const newUser = await findUser({ handle: user.handle });

    if(!newUser){
      return next(new AppError('Invalid registration', 401));
    }

    // Create an Access Token
    const { access_token } = await signToken(newUser);

    res.status(201).json({
      "name": user.name,
      "handle": user.handle,
      "gender": user.gender,
      "country": user.country,
      "avatar": user.avatar,
      "accessToken": access_token
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: 'fail',
        message: 'handle already exists',
      });
    }
    next(err);
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = await findUser({ handle: req.body.handle });

    // Check if user exists and password is correct
    if (!user) {
      return next(new AppError('Invalid handle', 401));
    }

    if (!(await user.comparePasswords(user.password, req.body.password))) {
      return next(new AppError('Invalid password', 401));
    }

    // Create an Access Token
    const { access_token } = await signToken(user);

    // Send Access Token in Cookie
    res.cookie('accessToken', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    res.status(200).json({
      status: 'success',
      accessToken: access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const logoutHandler = (req: Request, res: Response) => {
  let access_token;
  // Clear the access token cookie
  res.clearCookie('accessToken');
  res.clearCookie('logged_in');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    access_token = req.headers.authorization.split(' ')[1];
  }

  if(access_token){
    revokedTokens.push(access_token);
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
}


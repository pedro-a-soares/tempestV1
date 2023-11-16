import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user.model";
import { updateUserProfile } from "../services/user.service";
import { UpdateUserProfileInput } from "../schemas/user.schema";
import Imagekit from "imagekit";
import { uploadImage } from "../utils/initializeImages";

export const getMeHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user as User;
    res.status(200).json({
      name: user.name,
      handle: user.handle,
      gender: user.gender,
      country: user.country,
      avatar: user.avatar,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateProfile = async (
  req: Request<{}, {}, UpdateUserProfileInput>,
  res: Response,
  next: NextFunction
) => {
  const id = res.locals.user._id;
  try {
    let url: string;
    if (req.body.avatar && req.body.avatar.includes("data:image/png;base64")) {
      url = await uploadImage(req.body.avatar, `${req.body.handle}.png`) as string;
      req.body.avatar = url;
    }

    const user = await updateUserProfile({ _id: id }, req.body);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      name: user.name,
      handle: user.handle,
      gender: user.gender,
      country: user.country,
      avatar: user.avatar,
    });
  } catch (err: any) {
    next(err);
  }
};

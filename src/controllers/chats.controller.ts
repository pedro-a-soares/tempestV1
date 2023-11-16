import { NextFunction, Request, Response } from "express";
import {
  addContactById,
  isDuplicateContact,
} from "../services/contacts.service";
import { addMessage, findChat } from "../services/chats.service";
import { findUser } from "../services/user.service";
import { SendMessageInput, getMessagesInput } from "../schemas/chats.schema";

export const getMessages = async (
  req: Request<{}, {}, getMessagesInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    const chat = await findChat(user.handle, req.body.contact);

    if(!chat){
      return res.status(404).json({
        message: "chat not found",
    });
    }

    res.status(200).json({
      chat: {
        userHandles: chat.userHandles,
        messages: chat.messages
      }
    });
  } catch (err: any) {
    next(err);
  }
};

export const sendMessage = async (
  req: Request<{}, {}, SendMessageInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    // check if target contact is part of users contacts list
    const contact = await isDuplicateContact(user._id, req.body.contact);

    if (!contact) {
      return res.status(400).json({
        message: "No user with that handle exists on your contacts list",
      });
    }

    //check if user is part of target contacts list if not add user to target contact contacts list
    const userContact = await findUser({ handle: req.body.contact });

    if (!userContact) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    const isContactsContact = await isDuplicateContact(
      userContact._id as unknown as string,
      user.handle
    );

    if (!isContactsContact) {
      await addContactById(userContact._id as unknown as string, user.handle);
    }

    //create Chat or add messsage if it already exists
    const chat = await addMessage(
      user.handle,
      userContact.handle,
      req.body.message
    );

    // return all messages
    res.status(200).json({
      chat: {
        userHandles: chat.userHandles,
        messages: chat.messages
      }
    });
  } catch (err: any) {
    next(err);
  }
};

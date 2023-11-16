import { NextFunction, Request, Response } from 'express';
import { addContactById, contactExists, findUserContactsById, isDuplicateContact, userFullcontacts } from '../services/contacts.service';

export const getContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user._id ;
    const contacts = await findUserContactsById(userId);

    if(!contacts){
        return res.status(404).json({
            message: "contacts not found",
        });
    }

    const fullContacts = await userFullcontacts(contacts.contacts);

    const responseContacts = fullContacts.map((cont) => {
      return {
        name: cont.name,
        handle: cont.handle,
        gender: cont.gender,
        country: cont.country,
        avatar: cont.avatar
      };
    })

    res.status(200).json({
        contacts: responseContacts
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateContacts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = res.locals.user._id
  try {
    if(res.locals.user.handle === req.body.contact){
      return res.status(400).json({
        message: "Handle belongs to the user",
    });
    }

    const newContact = await contactExists(req.body.contact)

    if(!newContact){
        return res.status(400).json({
            message: "No user with that handle exists",
        });
    }

    const isDuplicate = await isDuplicateContact(id, req.body.contact)

    if(isDuplicate){
        return res.status(400).json({
            message: "handle already exists in user's contacts",
        });
    }

    const contacts = await addContactById(id, req.body.contact)

    if(!contacts){
      return res.status(400).json({
        message: "Unexpected error",
        });
    }

    const fullContacts = await userFullcontacts(contacts.contacts);

    const responseContacts = fullContacts.map((cont) => {
      return {
        name: cont.name,
        handle: cont.handle,
        gender: cont.gender,
        country: cont.country,
        avatar: cont.avatar
      };
    });

    res.status(200).json({
      contacts: responseContacts
    });
  } catch (err: any) {
    next(err)
  }
}


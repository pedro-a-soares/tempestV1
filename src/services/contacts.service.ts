import contactsModel, { Contacts } from '../../models/contacts.model';
import userModel, { User } from '../../models/user.model';
import { findUser } from './user.service';



// Find User by Id
export const findUserContactsById = async (id: string): Promise<Contacts | null> => {
  const query = {userId: id}
  const contacts = await contactsModel.findOne(query, {}, {});
  return contacts;
};

export const addContactById = async (id: string, contact: string): Promise<Contacts | null> => {
  const contacts = await findUserContactsById(id);

  if (!contacts) {
    await contactsModel.create({ userId: id, contacts: [contact] });
  } else {
    contacts.contacts.push(contact);
    await contactsModel.updateOne({ userId: id }, {
      $push: { contacts: contact },
    });
  }

  const currentContacts = await findUserContactsById(id);

  return currentContacts;
}

export const contactExists = async (contact: string): Promise<User | null> => {
  const user = await findUser({handle: contact});

  return user;
}

export const isDuplicateContact = async (id: string, contact:string): Promise<boolean> => {
  const userContacts = await findUserContactsById(id);

  if(userContacts){
    return userContacts.contacts.some((userContact) => userContact === contact)
  }

  return false;
}


export const userFullcontacts = async (contacts: string[]) => {
  const fullContacts = await userModel.find({ handle: { $in: contacts } }).exec();
  return fullContacts;
}





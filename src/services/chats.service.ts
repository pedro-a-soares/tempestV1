import ChatModel from "../../models/chats.model";

// Find User by Id
export const addMessage = async (userHandle: string, contactHandle: string, messageSent: string) => {
  let chat = await findChat(userHandle, contactHandle);

  if (!chat) {
    // Chat doesn't exist, create a new chat
    const newChat = new ChatModel({
      userHandles: [userHandle, contactHandle],
      messages: [
        {
          text: messageSent,
          userHandle: userHandle,
        },
      ],
    });

    chat = await newChat.save();
  } else {
    chat.messages.push({
      text: messageSent,
      userHandle: userHandle,
    });

    await chat.save(); // Save the existing chat using ChatModel
  }

  return chat;
};

export const findChat = async (handleA: string, handleB: string) => {
  const chat = await ChatModel.findOne({
    $or: [
      { userHandles: [handleA, handleB] },
      { userHandles: [handleB, handleA] },
    ],
  });
  return chat;
};

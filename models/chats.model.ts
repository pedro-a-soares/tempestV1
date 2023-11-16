import {
    getModelForClass,
    index,
    modelOptions,
    prop,
    Ref,
  } from '@typegoose/typegoose';
  
  // Define a message schema
  export class Message {
    @prop({ required: true })
    text: string;
  
    @prop({ required: true })
    userHandle: string;
  }
  
  @index({ userHandles: 1 }) // Index on userHandles
  @modelOptions({
    schemaOptions: {
      // Add createdAt and updatedAt fields
      timestamps: true,
    },
  })
  export class Chat {
    @prop({ required: true })
    userHandles: string[];
  
    @prop({ type: () => Message, _id: false, default: [] }) // Use Message type for messages
    messages: Message[];
  }
  
  // Create the Chat model
  const ChatModel = getModelForClass(Chat);
  export default ChatModel;
  
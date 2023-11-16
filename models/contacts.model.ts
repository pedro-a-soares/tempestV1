import {
    getModelForClass,
    index,
    modelOptions,
    prop,
} from '@typegoose/typegoose';
import { User } from './user.model';

@index({ userId: 1 })
@modelOptions({
    schemaOptions: {
        // Add createdAt and updatedAt fields
        timestamps: true,
    },
})

// Export the Contacts class to be used as TypeScript type
export class Contacts {
    @prop({ unique: true, required: true })
    userId: string;

    @prop({ required: true })
    contacts: string[]
   
}

// Create the contacts model from the User class
const contactsModel = getModelForClass(Contacts);
export default contactsModel;


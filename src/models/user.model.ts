import mongoose from 'mongoose';

import { IUserSchema } from '../types/models.types.js';

const { model, Schema } = mongoose;

const UserSchema = new Schema(
	{
		ip: Schema.Types.String,
	},
	{ timestamps: true }
);

export default model<IUserSchema>('Users', UserSchema);

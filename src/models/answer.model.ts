import mongoose from 'mongoose';

import { IAnswerSchema } from '../types/models.types.js';

const { model, Schema } = mongoose;

const AnswerSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'Users' },
		question: { type: Schema.Types.ObjectId, ref: 'Questions' },
		percent: Schema.Types.Number,
		answers: [Schema.Types.String],
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IAnswerSchema>('Answers', AnswerSchema);

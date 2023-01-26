import mongoose from 'mongoose';

import { ISettingsSchema } from '../types/models.types.js';

const { model, Schema } = mongoose;

const SettingsSchema = new Schema({
	port: Schema.Types.Number,
	windowMs: Schema.Types.Number,
	max: Schema.Types.Number,
	maxLogSize: Schema.Types.Number,
	maxLogBackups: Schema.Types.Number,
});

export default model<ISettingsSchema>('Settings', SettingsSchema);

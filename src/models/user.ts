import * as mongoose from 'mongoose';
import { visibilityPlugin } from './plugins/visibility';

export interface iUser {
  name: {
    first: string;
    last?: string;
  }
  email: string;
  password: string;
}

export const UserSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: false
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true  //hash password will be stored
  },
  role: {
    type: String,
    enum : ['User', 'Admin', 'SuperAdmin'],
    default: 'User'
  }
}, { timestamps: true, versionKey: false });

UserSchema.plugin(visibilityPlugin);

export const User = mongoose.model('User', UserSchema);


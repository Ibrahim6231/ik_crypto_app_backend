//external
import StandardError from 'standard-error';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//internal
import { envConfig } from '../../config/config';
import { Status } from '../../enum/httpStatus';
import { getJwtPayload, validateRegisterFields, validateToken } from './helper';
import { User } from '../../models/user';
import { UserRole } from '../../enum/modelsEnum';


const JWT_SECRET: string = envConfig.JWT_SECRET || "chatbot-app-scerectKey";
export class AuthRoutes {

  public static register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

      let { email, password, name } = req.body.user;
      email = email.toLowerCase().trim();

      validateRegisterFields(req.body.user);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new StandardError({ message: 'Email already in use', code: Status.CONFLICT });
      }

      //hash password
      const hash = bcrypt.hashSync(password, 10); // param2:saltRound

      const user = await User.create({
        email,
        name,
        password: hash,
        role: UserRole.USER
      })


      const generatedToken = jwt.sign(getJwtPayload(user), JWT_SECRET);

      const resObj: any = {};
      resObj.data = { token: generatedToken, user };
      return res.status(Status.OK).send(resObj);
    } catch (error) {
      return res.status(error.code || Status.SERVICE_UNAVAILABLE).send({ message: error.message });
    }
  }

  public static login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

      let { email, password } = req.body.user;
      email = email.toLowerCase().trim();

      const user = await User.findOne({ email }); //no need to add isDeleted or isVisible, as plugin is already inserted in models section with findOne query
      if (!user) {
        throw new StandardError({ message: 'User not registered', code: Status.NOT_FOUND });
      }
      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (!isPasswordMatch) {
        throw new StandardError({ message: 'Invalid credentials, Enter correct email & password', code: Status.NOT_FOUND });
      }

      const generatedToken = jwt.sign(getJwtPayload(user), JWT_SECRET);

      const resObj: any = {};
      resObj.data = { token: generatedToken, user };
      return res.status(Status.OK).send(resObj)
    } catch (error: any) {
      return res.status(error.code || 500).send({ status: false, message: error.message })
    }
  }
}

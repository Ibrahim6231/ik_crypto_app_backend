// NPM Dependencies
import * as express from 'express';
import StandardError from 'standard-error';

// Internal Dependencies
import { Status } from '../../enum/httpStatus';
import { UserHelper } from './helper';
import { CryptoWallet } from '../../models/cryptoWallet';

export class UserRoutes {
    public static getCoinsList = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const coins = await UserHelper.fetchAllCoingecko();
            const resObj: any = { data: coins };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }


    public static buyCoin = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { crypto, quantity } = req.body;
            //@ts-ignore
            const user = req.user;
            if (!crypto?.id) {
                throw new StandardError({ message: "Crypto Id is missing", code: Status.BAD_REQUEST })
            }
            if (quantity <= 0) {
                throw new StandardError({ message: "Invalid quantity", code: Status.UNPROCESSABLE_ENTITY })
            }
            if (!user?._id) {
                throw new StandardError({ message: "UnAuthorized", code: Status.UNAUTHORIZED })
            }
            
            const { id: cryptoId, name: cryptoName, current_price: rate } = crypto;

            let data = null;
            const cryptoExistInUser: any = await CryptoWallet.findOne({ userRef: user._id, cryptoId }).lean();
            if (cryptoExistInUser) {
                //then update
                data = await CryptoWallet.findByIdAndUpdate(
                    { _id: cryptoExistInUser._id },
                    { $inc: { quantity: quantity } },
                    { new: true }
                )
            } else {
                //create new
                data = await CryptoWallet.create({
                    userRef: user._id,
                    cryptoId,
                    cryptoName,
                    quantity,
                    rate
                })
            }


            const resObj: any = { data };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(Number(error.code) || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }


    public static getUserAllCoins = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //@ts-ignore
            const userId = req.user._id;
            if (!userId) {
                throw new StandardError({ message: "UnAuthorized", code: Status.UNAUTHORIZED })
            }
            
            const userCurrencies: any = await CryptoWallet.find({ userRef: userId }).lean();

            const resObj: any = { data: userCurrencies };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(Number(error.code) || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }
}

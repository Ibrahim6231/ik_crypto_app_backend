import axios from "axios";
import { User } from "../../models/user";
const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY || "no-api-key";


export class UserHelper {

    public static findById = async (userId: string) => {
        return User.findById(userId).lean();
    }

    public static fetchAllCoingecko = async () => {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
        const headers = { accept: 'application/json', 'x-cg-demo-api-key': API_KEY }
        
        const data = await axios.get(url, { headers })
        return data?.data;
    }
}

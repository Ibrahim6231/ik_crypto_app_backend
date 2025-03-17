// NPM Deps
import * as express from 'express';
import { UserRoutes } from './route';

// Internal Deps
export class UserRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router
      .post('/buy-coin', UserRoutes.buyCoin)
      .get('/all-coins', UserRoutes.getCoinsList)
      .get('/my-coins-wallet', UserRoutes.getUserAllCoins)
  }
}

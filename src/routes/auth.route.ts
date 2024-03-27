import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/getAuthRequest', this.auth.getAuthRequest);
    this.router.post('/callback', this.auth.callback);
    this.router.get('/status', this.auth.getStatus);
  }
}

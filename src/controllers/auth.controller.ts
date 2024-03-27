import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

import { AuthService, requestMap } from '@services/auth.service';
import getRawBody from 'raw-body';
import { auth as idAuth, resolver } from '@iden3/js-iden3-auth';
import path from 'path';

export class AuthController {
  public auth = Container.get(AuthService);

  public getStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const sessionId = req.query.sessionId as string;
      const finder = `${sessionId}authRes`;
      const statusReq = await this.auth.getStatus(finder);
      res.status(200).json({ data: statusReq, message: 'status' });
    } catch (error) {
      next(error);
    }
  };

  public callback = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // Get session ID from request
    const sessionId = req.query.sessionId;
    // get JWZ token params from the post request
    const raw = await getRawBody(req);
    const tokenStr = raw.toString().trim();
    const ethURL = 'https://polygon-mumbai.g.alchemy.com/v2/intmxEqkx_WWjQOTy4B6fVABv5UO-5xU';
    const contractAddress = '0x134B1BE34911E39A8397ec6289782989729807a4';
    const keyDIR = '../keys';
    const ethStateResolver = new resolver.EthStateResolver(ethURL, contractAddress);

    const resolvers = {
      ['polygon:mumbai']: ethStateResolver,
    };
    // fetch authRequest from sessionID
    const authRequest = requestMap.get(`${sessionId}`);
    // EXECUTE VERIFICATION
    const verifier = await idAuth.Verifier.newVerifier({
      stateResolver: resolvers,
      circuitsDir: path.join(__dirname, keyDIR),
      ipfsGatewayURL: 'https://ipfs.io',
    });
    try {
      const opts = {
        acceptedStateTransitionDelay: 5 * 60 * 1000, // 5 minute
      };
      const authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
      requestMap.set(`${sessionId}authRes`, {
        ...authRequest,
        isAuth: true,
        identifier: authResponse.from,
      });

      res.status(200).json({ data: authResponse, message: 'authenticated' });
    } catch (error) {
      next(error);
    }
  };

  public getAuthRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authRequest = await this.auth.getAuthRequest();

      res.status(200).json({ data: authRequest, message: 'getAuthRequest' });
    } catch (error) {
      next(error);
    }
  };
}

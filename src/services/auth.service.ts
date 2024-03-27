import { Service } from 'typedi';

import { AuthRequestInterface } from '@interfaces/auth.interface';

import { auth } from '@iden3/js-iden3-auth';
import { uuid } from 'uuidv4';

export const requestMap = new Map();
interface ReturnResponse {
  request: AuthRequestInterface;
  sessionId: string;
}

@Service()
export class AuthService {
  // public async callback()
  public async getAuthRequest(): Promise<ReturnResponse> {
    const hostUrl = process.env.NGROK_URL;
    const sessionId = uuid();
    const callbackURL = '/callback';
    const audience = 'did:polygonid:polygon:mumbai:2qDyy1kEo2AYcP3RT4XGea7BtxsY285szg6yP9SPrs';
    const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;
    // Generate request for basic authentication
    const request = auth.createAuthorizationRequest('test flow', audience, uri);
    request.id = '7f38a193-0918-4a48-9fac-36adfdb8b542';
    request.thid = '7f38a193-0918-4a48-9fac-36adfdb8b542';

    // Add request for a specific proof
    // const proofRequest = {
    //   id: 1,
    //   circuitId: 'credentialAtomicQuerySigV2',
    //   query: {
    //     allowedIssuers: ['*'],
    //     type: 'KYCAgeCredential',
    //     context: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
    //     credentialSubject: {
    //       birthday: {
    //         $lt: 20000101,
    //       },
    //     },
    //   },
    // };
    const scope = request.body.scope ?? [];
    // request.body.scope = [...scope, proofRequest];
    request.body.scope = [...scope];

    // Store auth request in map associated with session ID
    requestMap.set(`${sessionId}`, request);
    const returnResponse = {
      request: request,
      sessionId: sessionId,
    };

    return returnResponse as ReturnResponse;
  }

  public getStatus = async (sessionId: string): Promise<any> => {
    // Get request from map
    const request = requestMap.get(sessionId);
    if (!request) {
      throw new Error('Request not found');
    }
    // Get status from request
    const status = request;
    return status;
  };
}

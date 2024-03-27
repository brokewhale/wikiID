export interface AuthRequestInterface {
  id: string;
  thid: string;
  from: string;
  typ: string;
  type: string;
  body: {
    reason: string;
    message: string;
    callbackUrl: string;
    scope?: any[];
  };
}

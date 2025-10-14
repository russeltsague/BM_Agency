import { Request } from 'express';

export interface IUserPayload {
  id: string;
  role: string;
  [key: string]: any;
}

export interface CustomRequest extends Request {
  user?: IUserPayload;
  requestTime?: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUserPayload;
    requestTime?: string;
  }
}

declare module 'xss-clean' {
  const xss: () => any;
  export default xss;
}

declare module 'hpp' {
  const hpp: () => any;
  export default hpp;
}

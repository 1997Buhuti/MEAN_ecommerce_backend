import { RequestHandler, Request } from "express";
import { expressjwt } from "express-jwt";

function isRevoked(req: Request, token: any): boolean {
  if (!token || !token.isAdmin) {
    return true;
  }
  return false;
}

function authJwt(): RequestHandler {
  const secret = process.env.secret!;
  const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      // { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      // `${api}/users/login`,
      // `${api}/users/register`,
      { url: /{.*}/ },
    ],
  });
}

export default authJwt;

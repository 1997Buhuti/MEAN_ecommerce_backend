import { RequestHandler } from "express";
import { expressjwt } from "express-jwt";

function isRevoked(_req: any, token: any): boolean {
  return false;
}

function authJwt(): RequestHandler {
  const secret = process.env.SECRET || process.env.secret || "";
  const api = process.env.API_URI || "";
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      `${api}/users/login`,
      `${api}/users/register`,
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: new RegExp(`^${api}\\/products(.*)$`), methods: ["GET", "OPTIONS"] },
      { url: new RegExp(`^${api}\\/categories(.*)$`), methods: ["GET", "OPTIONS"] },
    ],
  });
}

export const auth = (): RequestHandler => authJwt();

import type { User } from "../domain/model/user.js";

declare global {
  namespace Express {
    interface Request {
      authUser?: User;
    }
  }
}

export {};

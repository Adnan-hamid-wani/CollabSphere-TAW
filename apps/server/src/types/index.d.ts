import { User } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      user?: User; // from auth middleware
      io?: SocketIOServer; // for socket usage
      socketId?: string;
      auth?: {
        user: {
          id: string;
          username: string;
          email: string;
          role: "USER" | "ADMIN";
          avatar?: string;
        };
      };


    }
  }
}

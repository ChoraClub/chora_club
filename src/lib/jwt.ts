import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "";

export function signJWT(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}

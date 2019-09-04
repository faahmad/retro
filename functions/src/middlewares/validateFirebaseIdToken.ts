import * as admin from "firebase-admin";
import { Response, NextFunction } from "express";

export const validateFirebaseIdToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    console.log("No authorization header");
    res.status(403).send("Unauthorized");
    return;
  }

  const idToken = req.headers.authorization;

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    console.log("Invalid token");
    res.status(403).send("Unauthorized");
    return;
  }
};

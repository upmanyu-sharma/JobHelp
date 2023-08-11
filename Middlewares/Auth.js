import jwt from "jsonwebtoken";
import { unAuthenticated } from "../errors/index.js";

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new unAuthenticated("Authentication invalid");
  }
  if (!authHeader.startsWith("Bearer")) {
    throw new unAuthenticated("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new unAuthenticated("Authentication invalid");
  }
};

export default auth;

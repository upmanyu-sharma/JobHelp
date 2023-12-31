import { StatusCodes } from "http-status-codes";
import customAPIError from "./custom-api.js";

class unAuthenticated extends customAPIError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.UNAUTHORIZED;
  }
}
export default unAuthenticated;

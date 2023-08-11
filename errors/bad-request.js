import { StatusCodes } from "http-status-codes";
import customAPIError from "./custom-api.js";

class badRequestError extends customAPIError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.BAD_REQUEST;
  }
}
export default badRequestError;

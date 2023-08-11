import { StatusCodes } from "http-status-codes";
import customAPIError from "./custom-api.js";

class notFoundError extends customAPIError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.NOT_FOUND;
  }
}
export default notFoundError;

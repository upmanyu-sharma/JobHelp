import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  //this error.message is given by our controller
  console.log(err.message);

  const defaultError = {
    StatusCode: err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, Try again later!",
  };

  //below 2 are given by mongoose
  //if user gives wrong value or does'nt gives value of fields (as is is required in it)
  if (err.name === "ValidationError") {
    defaultError.StatusCode = StatusCodes.BAD_REQUEST;
    // defaultError.msg = err.message;
    defaultError.msg = Object.values(err.errors)
      .map((item) => {
        return item.message;
      })
      .join(", ");
  }

  //if user gives same value again(as we need unique values only)
  if (err.code && err.code === 11000) {
    defaultError.StatusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique!`;
  }
  res.status(defaultError.StatusCode).json({ msg: defaultError.msg });
  // res.status(defaultError.StatusCode).json({ err });
};
export default errorHandler;

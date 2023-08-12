import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { badRequestError, notFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new badRequestError("Please Provide All Values");
  }

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  //in case of all no need to add as query parameter
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  // NO AWAIT
  let result = Job.find(queryObject);

  // sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt"); // '-' denotes desending
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; //skip these no. of jobs for each page
  result = result.skip(skip).limit(limit);
  // 75 = 10 10 10 10 10 10 10 5
  const jobs = await result;

  //jobs are having only "limit" no. of jobs, but we want total count so we use this method.
  const noOfJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(noOfJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, noOfJobs, numOfPages });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new notFoundError(`No job with id : ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Job removed" });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;

  const { company, position } = req.body;

  if (!company || !position) {
    throw new badRequestError("Please Provide All Values");
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new notFoundError(`No job with id ${jobId}`);
  }
  // check permissions so that someone else should not be able to updated somebody's job if he gets access to its id(job).

  checkPermissions(req.user, job.createdBy);

  //in this if we don't pass value and it also does'nt have any default value then it will not throw any error, just marks it as undefined, but in case of job.save it throws error. but this does'nt work it we have hooks, meaning using this will not trigger hooks, but job.save does.
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: jobTitle, count } = curr;
    acc[jobTitle] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = [];

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
export { createJob, getAllJobs, deleteJob, updateJob, showStats };

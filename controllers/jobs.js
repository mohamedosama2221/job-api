const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getJobs = async (req, res) => {
  const { userId } = req.user;

  const jobs = await Job.find({ createdBy: userId }).sort("createdAt");

  return res
    .status(StatusCodes.OK)
    .json({ success: true, data: jobs, count: jobs.length });
};

const getSingleJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job found with an id equal to ${jobId}`);
  }

  return res.status(StatusCodes.OK).json({ success: true, data: job });
};

const createJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company and position can't be empty");
  }

  const job = await Job.create({ ...req.body, createdBy: userId });

  return res.status(StatusCodes.CREATED).json({ data: job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("Company and position can't be empty");
  }
  const job = await Job.updateOne(
    { _id: jobId, createdBy: userId },
    { ...req.body },
    { runValidators: true }
  );

  return res.status(StatusCodes.OK).json({ data: job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.deleteOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job found with an id equal to ${jobId}`);
  }
  return res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "job has been deleted" });
};

module.exports = {
  getJobs,
  getSingleJobs,
  createJob,
  updateJob,
  deleteJob,
};

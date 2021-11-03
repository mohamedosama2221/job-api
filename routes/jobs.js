const express = require("express");
const router = express.Router();
const {
  getJobs,
  createJob,
  getSingleJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.get("/", getJobs);
router.get("/:id", getSingleJobs);
router.post("/", createJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;

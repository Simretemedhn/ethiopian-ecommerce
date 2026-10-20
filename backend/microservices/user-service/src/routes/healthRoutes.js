
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "user-service",
    status: "healthy",
  });
});

module.exports = router;

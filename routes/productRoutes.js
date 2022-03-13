import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello from my GET endpoint :)" });
});

router.post("/", (req, res) => {
  res.status(200).json({ msg: "Hello from my POST endpoint :)" });
});

export default router;

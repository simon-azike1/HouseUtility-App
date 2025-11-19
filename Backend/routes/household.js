// backend/routes/household.js
import express from "express";
import Household from "../models/Household.js"; 
import { protect as verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Create a new household
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { name, address } = req.body;

    const household = await Household.create({
      name,
      address,
      members: [{ user: req.user._id, role: "owner" }], // creator as owner
      owner: req.user._id,
      inviteCode: new Household().generateInviteCode()
    });

    res.status(201).json({ message: "Household created successfully", household });
  } catch (error) {
    console.error("Create household error:", error);
    res.status(500).json({ error: "Failed to create household" });
  }
});

// ✅ Join an existing household
router.post("/join", verifyToken, async (req, res) => {
  try {
    const { householdId } = req.body;
    const household = await Household.findById(householdId);

    if (!household) {
      return res.status(404).json({ error: "Household not found" });
    }

    // Avoid duplicates
    if (!household.members.some(m => m.user.toString() === req.user._id.toString())) {
      household.members.push({ user: req.user._id, role: "member" });
      await household.save();
    }

    res.json({ message: "Joined household successfully", household });
  } catch (error) {
    console.error("Join household error:", error);
    res.status(500).json({ error: "Failed to join household" });
  }
});

// ✅ Get current user’s household
router.get("/", verifyToken, async (req, res) => {
  try {
    const household = await Household.findOne({ "members.user": req.user._id }).populate("members.user", "name email");
    if (!household) {
      return res.status(404).json({ message: "No household found for this user" });
    }
    res.json(household);
  } catch (error) {
    console.error("Get household error:", error);
    res.status(500).json({ error: "Failed to fetch household" });
  }
});

// ✅ Get all members in a household
router.get("/members", verifyToken, async (req, res) => {
  try {
    const household = await Household.findOne({ "members.user": req.user._id }).populate("members.user", "name email");
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }
    res.json(household.members);
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Failed to fetch household members" });
  }
});

export default router;

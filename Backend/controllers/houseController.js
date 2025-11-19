// controllers/householdController.js
import Household from "../models/householdModel.js";
import User from "../models/userModel.js";

export const getMembers = async (req, res) => {
  try {
    // Find the household the current user belongs to
    const household = await Household.findById(req.user.household);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    // Fetch all users that belong to this household
    const members = await User.find({ household: household._id }).select("-password");
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

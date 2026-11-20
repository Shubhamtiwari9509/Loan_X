import { Prediction } from "../models/Prediction.js";
import { User } from "../models/User.js";

export async function getOverviewStats(req, res, next) {
  try {
    const [
      totalUsers,
      totalPredictions,
      approvedPredictions,
      rejectedPredictions,
      recentPredictions,
      avgProbabilityData
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Prediction.countDocuments(),
      Prediction.countDocuments({ decision: "Approved" }),
      Prediction.countDocuments({ decision: "Rejected" }),
      Prediction.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email")
        .lean(),
      Prediction.aggregate([
        {
          $group: {
            _id: null,
            avgApprovalProb: { $avg: "$approvalProbability" },
            avgCreditScore: { $avg: "$inputFeatures.Credit_Score" },
            avgLoanAmount: { $avg: "$inputFeatures.Loan_Amount" }
          }
        }
      ])
    ]);

    const stats = (Array.isArray(avgProbabilityData) && avgProbabilityData[0]) || {
      avgApprovalProb: 0,
      avgCreditScore: 0,
      avgLoanAmount: 0
    };

    const approvalRate =
      totalPredictions > 0
        ? Math.round((approvedPredictions / totalPredictions) * 100)
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPredictions,
        approvedPredictions,
        rejectedPredictions,
        approvalRate,
        avgApprovalProbability: Math.round((stats.avgApprovalProb || 0) * 100) / 100,
        avgCreditScore: Math.round(stats.avgCreditScore || 0),
        avgLoanAmount: Math.round(stats.avgLoanAmount || 0)
      },
      recentPredictions
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllPredictions(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "10", 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.decision) {
      query.decision = req.query.decision;
    }
    if (req.query.loanPurpose) {
      query["inputFeatures.Loan_Purpose"] = req.query.loanPurpose;
    }

    const [predictions, total] = await Promise.all([
      Prediction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email")
        .lean(),
      Prediction.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      predictions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "10", 10)));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments()
    ]);

    // Attach prediction count to each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const predictionCount = await Prediction.countDocuments({ userId: u._id });
        return {
          ...u,
          predictionCount
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithStats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Must be 'user' or 'admin'."
      });
    }

    // Prevent an admin from demoting themselves
    if (id === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Administrators cannot remove their own admin privileges."
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}.`,
      user
    });
  } catch (error) {
    next(error);
  }
}

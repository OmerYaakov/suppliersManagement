import supplierModel from "../Models/supplierModel.js";
import transactionModel from "../Models/transactionModel.js";
import userModel from "../Models/userModel.js";

const getStats = async (req, res) => {
  try {
    console.log("Logged in admin:", req.user);

    const users = await userModel.find({}, "_id email");
    const supplierCount = await supplierModel.countDocuments();
    const totalTransactions = await transactionModel.countDocuments();

    const totalAmountAgg = await transactionModel.aggregate([
      { $group: { _id: null, sum: { $sum: "$transactionAmount" } } },
    ]);

    const userSummaries = await Promise.all(
      users.map(async (user) => {
        const userTxns = await transactionModel.aggregate([
          { $match: { createdBy: user._id } },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$transactionAmount" },
              count: { $sum: 1 },
            },
          },
        ]);

        return {
          email: user.email,
          totalAmount: userTxns[0]?.totalAmount || 0,
          transactionCount: userTxns[0]?.count || 0,
        };
      })
    );

    res.json({
      userSummaries,
      userCount: users.length,
      supplierCount,
      totalTransactions,
      totalAmount: totalAmountAgg[0]?.sum || 0,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
};

export default { getStats };

// middlewares/isAdmin.js
export default function isAdmin(req, res, next) {
  console.log("🧪 isAdmin middleware check:");
  console.log("🔐 ADMIN_EMAIL from env:", process.env.ADMIN_EMAIL);
  console.log("👤 Email from token:", req.user?.email);

  if (req.user?.email === "omeryaakov2@gmail.com") {
    console.log("✅ Admin verified, proceeding...");
    return next();
  }

  console.warn("⛔ Access denied: User is not admin.");
  return res.status(403).json({ message: "Access denied" });
}

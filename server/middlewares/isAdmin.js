// middlewares/isAdmin.js
export default function isAdmin(req, res, next) {
  if (req.user?.email === process.env.ADMIN_EMAIL) return next();
  return res.status(403).json({ message: "Access denied" });
}

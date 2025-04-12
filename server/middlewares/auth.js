import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded); // Log the decoded token to verify it

    req.user = decoded; // Attach the decoded user info to the request object
    next(); // Proceed to the next middleware/route
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default checkAuth;

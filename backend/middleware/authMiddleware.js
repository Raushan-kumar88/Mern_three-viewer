import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    if (!token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized", error: error.message });
  }
};

export default protect;
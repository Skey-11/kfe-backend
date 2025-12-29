const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next(); 
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.requireRole = (...allowed) => (req, res, next) => {
  const roles = req.user?.roles || [];
  const ok = roles.some((r) => allowed.includes(r));
  if (!ok) return res.status(403).json({ message: "Forbidden (role)" });
  return next(); 
};

const jwt = require("jsonwebtoken");

module.exports = function authRequired(req, res, next) {
  const [type, token] = (req.headers.authorization || "").split(" ");
  if (type !== "Bearer" || !token)
    return res.status(401).json({ error: "Login required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    if (!payload?.id) return res.status(401).json({ error: "Invalid token" });
    req.user = {
      id: payload.id,
      email: payload.email,
      role_id: payload.role_id,
    };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

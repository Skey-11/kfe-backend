const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const repo = require("../repositories/auth.repo");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "username y password requeridos" });

  const user = await repo.findUserByUsername(username);
  if (!user || user.is_active !== 1) return res.status(401).json({ message: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });

  const roles = await repo.getRolesByUserId(user.id);

  const token = jwt.sign(
    { userId: user.id, username: user.username, roles },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, roles });
};

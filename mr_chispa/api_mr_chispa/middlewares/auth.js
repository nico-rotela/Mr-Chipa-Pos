import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "token no enviado" });
    }

    const token = authHeader.split(" ")[1]; //[0]bearer / [1]token

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // valido firma y expiracion
    req.user = decoded; // token del usuario loggeado
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

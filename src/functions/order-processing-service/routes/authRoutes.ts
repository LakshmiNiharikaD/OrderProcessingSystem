import * as express from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { body, validationResult } from "express-validator";
import * as cookieParser from "cookie-parser";

dotenv.config();

const router = express.Router();
const users: { email: string; password: string; id: string }[] = [];

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const refreshTokens: string[] = [];

router.use(cookieParser()); // Use cookie parser middleware

// Generate JWT Token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
};

// Generate Refresh Token
const generateRefreshToken = (userId: string) => {
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });
  refreshTokens.push(refreshToken);
  return refreshToken;
};

// Register User
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res): Promise<any> => {
    try {
      const { email, password } = req.body;
      if (users.some((user) => user.email === email)) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        password: hashedPassword,
        id: Date.now().toString(),
      };

      users.push(newUser);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      throw error;
    }
  }
);

// Login User
router.post("/login", async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    throw error;
  }
});

// Refresh Token
router.post("/refresh/:userId", async (req, res): Promise<any> => {
  const { userId } = req.params;
  try {
    const newAccessToken = generateRefreshToken(userId);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({ message: "Token refreshed", accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

// Logout User (Clear Cookies)
router.post("/logout", async (req, res): Promise<any> => {
  try {
    console.log(req);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    throw error;
  }
});

export default router;

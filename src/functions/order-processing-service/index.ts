import * as express from "express";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import * as cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

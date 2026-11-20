import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/db.js";
import { config } from "../config/env.js";
import { User } from "../models/User.js";

async function seedAdmin() {
  const { name, email, password } = config.adminSeed;

  if (!email || !password) {
    console.error("[Admin Seed] Error: ADMIN_EMAIL and ADMIN_PASSWORD must be configured in environment variables.");
    process.exit(1);
  }

  try {
    await connectDB();

    console.log(`[Admin Seed] Checking if admin account exists for email: ${email}...`);

    let adminUser = await User.findOne({ email });

    if (adminUser) {
      if (adminUser.role === "admin") {
        console.log(`[Admin Seed] Admin account already exists for ${email}. No changes made.`);
      } else {
        adminUser.role = "admin";
        await adminUser.save();
        console.log(`[Admin Seed] Existing user ${email} successfully promoted to admin role.`);
      }
    } else {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      adminUser = await User.create({
        name,
        email,
        passwordHash,
        role: "admin"
      });

      console.log(`[Admin Seed] Admin account created successfully for: ${adminUser.email}`);
    }

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("[Admin Seed] Fatal error seeding admin:", error.message);
    await disconnectDB().catch(() => {});
    process.exit(1);
  }
}

seedAdmin();

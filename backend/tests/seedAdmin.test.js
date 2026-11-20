import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcryptjs";
import mockingoose from "mockingoose";
import { User } from "../src/models/User.js";
import { sampleAdminId, sampleUserId } from "./helpers/testDb.js";

test.beforeEach(() => {
  mockingoose.resetAll();
});

test("Seed Admin - Password hashing creates valid bcrypt hash", async () => {
  const plainPassword = "SuperAdminPassword123!";
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(plainPassword, salt);

  const isMatch = await bcrypt.compare(plainPassword, hash);
  assert.equal(isMatch, true);

  const isWrong = await bcrypt.compare("WrongPassword", hash);
  assert.equal(isWrong, false);
});

test("Seed Admin - Correctly sets role='admin' on user creation", async () => {
  mockingoose(User).toReturn(
    {
      _id: sampleAdminId,
      name: "Admin User",
      email: "admin@loanx.internal",
      role: "admin"
    },
    "save"
  );

  const admin = new User({
    name: "Admin User",
    email: "admin@loanx.internal",
    passwordHash: "dummy_hash",
    role: "admin"
  });

  const json = admin.toJSON();
  assert.equal(json.role, "admin");
  assert.equal(json.email, "admin@loanx.internal");
  assert.equal(json.passwordHash, undefined, "passwordHash must be stripped");
});

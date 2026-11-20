import assert from "node:assert/strict";
import test from "node:test";
import bcrypt from "bcryptjs";
import mockingoose from "mockingoose";
import request from "supertest";
import { app } from "../src/app.js";
import { User } from "../src/models/User.js";
import { generateTestToken, sampleUserId } from "./helpers/testDb.js";

test.beforeEach(() => {
  mockingoose.resetAll();
});

test("POST /api/auth/register - Successfully registers user with hashed password and role='user'", async () => {
  mockingoose(User).toReturn(null, "findOne");
  mockingoose(User).toReturn(
    (query) => ({
      _id: sampleUserId,
      name: query.name,
      email: query.email,
      passwordHash: "hashed_dummy",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    "save"
  );

  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Rohan Sharma",
      email: "rohan@example.com",
      password: "Password123!"
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, "rohan@example.com");
  assert.equal(res.body.user.role, "user");
  assert.equal(res.body.user.passwordHash, undefined, "Password hash must never be returned");
});

test("POST /api/auth/register - Rejects registration when email already exists", async () => {
  mockingoose(User).toReturn(
    { _id: sampleUserId, email: "existing@example.com" },
    "findOne"
  );

  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Existing User",
      email: "existing@example.com",
      password: "Password123!"
    });

  assert.equal(res.status, 409);
  assert.equal(res.body.success, false);
});

test("POST /api/auth/register - Rejects invalid inputs (e.g. short password, invalid email)", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "R",
      email: "not-an-email",
      password: "short"
    });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(Array.isArray(res.body.errors));
});

test("POST /api/auth/login - Successfully logs in with valid credentials", async () => {
  const rawPassword = "ValidPassword123!";
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  mockingoose(User).toReturn(
    {
      _id: sampleUserId,
      name: "Rohan Sharma",
      email: "rohan@example.com",
      passwordHash,
      role: "user"
    },
    "findOne"
  );

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "rohan@example.com",
      password: rawPassword
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, "rohan@example.com");
});

test("POST /api/auth/login - Rejects login with incorrect password", async () => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("CorrectPassword123!", salt);

  mockingoose(User).toReturn(
    {
      _id: sampleUserId,
      name: "Rohan Sharma",
      email: "rohan@example.com",
      passwordHash,
      role: "user"
    },
    "findOne"
  );

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "rohan@example.com",
      password: "WrongPassword999!"
    });

  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message, "Invalid email or password.");
});

test("GET /api/auth/me - Returns current user when authenticated with Bearer token", async () => {
  const token = generateTestToken(sampleUserId, "user");

  mockingoose(User).toReturn(
    {
      _id: sampleUserId,
      name: "Rohan Sharma",
      email: "rohan@example.com",
      role: "user"
    },
    "findOne"
  );

  const res = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.user.email, "rohan@example.com");
});

test("GET /api/auth/me - Rejects request with missing or invalid token", async () => {
  const resNoAuth = await request(app).get("/api/auth/me");
  assert.equal(resNoAuth.status, 401);

  const resBadToken = await request(app)
    .get("/api/auth/me")
    .set("Authorization", "Bearer invalid_garbage_token");
  assert.equal(resBadToken.status, 401);
});

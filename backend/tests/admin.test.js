import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";
import mockingoose from "mockingoose";
import request from "supertest";
import { app } from "../src/app.js";
import { Prediction } from "../src/models/Prediction.js";
import { User } from "../src/models/User.js";
import {
  generateTestToken,
  sampleAdminId,
  sampleOtherUserId,
  sampleUserId
} from "./helpers/testDb.js";

test.beforeEach(() => {
  mockingoose.resetAll();
});

test("Admin Routes - Rejects normal user without admin privileges (403 Forbidden)", async () => {
  const userToken = generateTestToken(sampleUserId, "user");
  mockingoose(User).toReturn(
    { _id: sampleUserId, name: "Normal User", role: "user" },
    "findOne"
  );

  const res = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", `Bearer ${userToken}`);

  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /Administrator privileges required/i);
});

test("GET /api/admin/stats - Returns platform overview statistics for admin", async () => {
  const adminToken = generateTestToken(sampleAdminId, "admin");
  mockingoose(User).toReturn(
    { _id: sampleAdminId, name: "Admin", role: "admin" },
    "findOne"
  );

  mockingoose(User).toReturn(25, "countDocuments"); // 25 users
  mockingoose(Prediction).toReturn(50, "countDocuments"); // 50 predictions
  mockingoose(Prediction).toReturn([], "find"); // recent predictions

  const res = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.stats);
  assert.equal(typeof res.body.stats.approvalRate, "number");
  assert.ok(Array.isArray(res.body.recentPredictions));
});

test("GET /api/admin/predictions - Returns paginated list of all predictions for admin", async () => {
  const adminToken = generateTestToken(sampleAdminId, "admin");
  mockingoose(User).toReturn(
    { _id: sampleAdminId, name: "Admin", role: "admin" },
    "findOne"
  );

  const mockPredictions = [
    {
      _id: new mongoose.Types.ObjectId(),
      userId: { name: "User 1", email: "user1@example.com" },
      decision: "Approved",
      approvalProbability: 0.96
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: { name: "User 2", email: "user2@example.com" },
      decision: "Rejected",
      approvalProbability: 0.12
    }
  ];

  mockingoose(Prediction).toReturn(mockPredictions, "find");
  mockingoose(Prediction).toReturn(2, "countDocuments");

  const res = await request(app)
    .get("/api/admin/predictions")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.predictions.length, 2);
  assert.equal(res.body.pagination.total, 2);
});

test("GET /api/admin/users - Returns list of registered users with prediction counts", async () => {
  const adminToken = generateTestToken(sampleAdminId, "admin");
  mockingoose(User).toReturn(
    { _id: sampleAdminId, name: "Admin", role: "admin" },
    "findOne"
  );

  const mockUsers = [
    {
      _id: sampleUserId,
      name: "User One",
      email: "user1@example.com",
      role: "user"
    }
  ];

  mockingoose(User).toReturn(mockUsers, "find");
  mockingoose(User).toReturn(1, "countDocuments");
  mockingoose(Prediction).toReturn(3, "countDocuments");

  const res = await request(app)
    .get("/api/admin/users")
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.users.length, 1);
  assert.equal(res.body.users[0].predictionCount, 3);
});

test("PATCH /api/admin/users/:id/role - Admin cannot demote their own account", async () => {
  const adminToken = generateTestToken(sampleAdminId, "admin");
  mockingoose(User).toReturn(
    { _id: sampleAdminId, name: "Admin", role: "admin" },
    "findOne"
  );

  const res = await request(app)
    .patch(`/api/admin/users/${sampleAdminId}/role`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ role: "user" });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /cannot remove their own admin privileges/i);
});

test("PATCH /api/admin/users/:id/role - Admin successfully updates another user's role", async () => {
  const adminToken = generateTestToken(sampleAdminId, "admin");
  mockingoose(User).toReturn(
    { _id: sampleAdminId, name: "Admin", role: "admin" },
    "findOne"
  );

  mockingoose(User).toReturn(
    {
      _id: sampleOtherUserId,
      name: "Promoted User",
      email: "promoted@example.com",
      role: "admin"
    },
    "findOneAndUpdate"
  );

  const res = await request(app)
    .patch(`/api/admin/users/${sampleOtherUserId}/role`)
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ role: "admin" });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.user.role, "admin");
});

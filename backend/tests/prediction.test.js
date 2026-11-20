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
  sampleUserId,
  sampleValidInputFeatures
} from "./helpers/testDb.js";

test.beforeEach(() => {
  mockingoose.resetAll();
});

test("POST /api/predictions - Validates 18 required features and rejects invalid category", async () => {
  const token = generateTestToken(sampleUserId, "user");
  mockingoose(User).toReturn(
    { _id: sampleUserId, name: "Test User", role: "user" },
    "findOne"
  );

  const invalidPayload = {
    ...sampleValidInputFeatures,
    Employment_Status: "Astronaut" // Invalid category
  };

  const res = await request(app)
    .post("/api/predictions")
    .set("Authorization", `Bearer ${token}`)
    .send(invalidPayload);

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test("POST /api/predictions - Evaluates loan with ML service and saves result in DB", async () => {
  const token = generateTestToken(sampleUserId, "user");
  mockingoose(User).toReturn(
    { _id: sampleUserId, name: "Test User", role: "user" },
    "findOne"
  );

  mockingoose(Prediction).toReturn(
    (query) => ({
      _id: new mongoose.Types.ObjectId(),
      userId: sampleUserId,
      inputFeatures: sampleValidInputFeatures,
      predictedClass: 1,
      decision: "Approved",
      approvalProbability: 0.9941,
      rejectionProbability: 0.0059,
      modelVersion: "1.0.0-creditwise-pipeline",
      disclaimer: "Legal disclaimer",
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    "save"
  );

  const res = await request(app)
    .post("/api/predictions")
    .set("Authorization", `Bearer ${token}`)
    .send(sampleValidInputFeatures);

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.prediction.decision, "Approved");
  assert.equal(res.body.prediction.predictedClass, 1);
  assert.ok(res.body.prediction.approvalProbability > 0.85);
  assert.equal(res.body.prediction.userId.toString(), sampleUserId.toString());
});

test("GET /api/predictions - User only retrieves their own prediction history", async () => {
  const token = generateTestToken(sampleUserId, "user");
  mockingoose(User).toReturn(
    { _id: sampleUserId, name: "Test User", role: "user" },
    "findOne"
  );

  const mockUserPredictions = [
    {
      _id: new mongoose.Types.ObjectId(),
      userId: sampleUserId,
      decision: "Approved",
      approvalProbability: 0.95,
      createdAt: new Date()
    }
  ];

  mockingoose(Prediction).toReturn(mockUserPredictions, "find");
  mockingoose(Prediction).toReturn(1, "countDocuments");

  const res = await request(app)
    .get("/api/predictions")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.predictions.length, 1);
  assert.equal(res.body.pagination.total, 1);
});

test("GET /api/predictions/:id - Blocks user from viewing another user's prediction record (403)", async () => {
  const token = generateTestToken(sampleUserId, "user");
  mockingoose(User).toReturn(
    { _id: sampleUserId, name: "Test User", role: "user" },
    "findOne"
  );

  const targetPredictionId = new mongoose.Types.ObjectId();
  // Prediction belongs to sampleOtherUserId
  mockingoose(Prediction).toReturn(
    {
      _id: targetPredictionId,
      userId: sampleOtherUserId,
      decision: "Rejected",
      approvalProbability: 0.05
    },
    "findOne"
  );

  const res = await request(app)
    .get(`/api/predictions/${targetPredictionId}`)
    .set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /Access denied/i);
});

test("GET /api/predictions/:id - Allows admin to view any user's prediction record", async () => {
  const adminToken = generateTestToken(sampleAdminId, "admin");
  mockingoose(User).toReturn(
    { _id: sampleAdminId, name: "Admin", role: "admin" },
    "findOne"
  );

  const targetPredictionId = new mongoose.Types.ObjectId();
  mockingoose(Prediction).toReturn(
    {
      _id: targetPredictionId,
      userId: sampleOtherUserId,
      decision: "Approved",
      approvalProbability: 0.92
    },
    "findOne"
  );

  const res = await request(app)
    .get(`/api/predictions/${targetPredictionId}`)
    .set("Authorization", `Bearer ${adminToken}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.prediction.decision, "Approved");
});

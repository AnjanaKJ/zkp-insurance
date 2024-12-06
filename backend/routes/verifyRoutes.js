const express = require("express");
const router = express.Router();
const proofController = require("../controllers/proofController");

// Define the route for verifying proofs
router.post("/verify-proof", proofController.verifyProof);

module.exports = router;

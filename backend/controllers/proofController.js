//const snarkjs = require("snarkjs");
//const fs = require("fs");
//
//// Load the verification key once at the start
//const vKey = JSON.parse(fs.readFileSync("../backend/circom/verification_key.json"));
//
///**
// * Verifies the zk-SNARK proof
// * @param {Object} req - The request object
// * @param {Object} res - The response object
// */
//exports.verifyProof = async (req, res) => {
//    try {
//        const input = req.body;
//
//        // Extract the proof and public signals from the input
//        const proof = input.proof.proof;
//        const publicSignals = input.proof.publicSignals;
//
//        // Format the proof object for snarkjs
//        const formattedProof = {
//            pi_a: proof.pi_a,
//            pi_b: [proof.pi_b[0], proof.pi_b[1]],
//            pi_c: proof.pi_c,
//        };
//
//        // Verify the proof
//        const isValid = await snarkjs.groth16.verify(vKey, publicSignals, formattedProof);
//
//        // Respond with the verification result
//        if (isValid) {
//            res.json({ success: true, valid: true, message: "Proof is valid" });
//        } else {
//            res.json({ success: true, valid: false, message: "Proof is invalid" });
//        }
//    } catch (error) {
//        console.error(error);
//        res.status(500).json({ success: false, error: "Error verifying proof" });
//    }
//};

// controller/verifyController.js
const {Web3} = require("web3");
const dotenv = require("dotenv");

dotenv.config();

const web3 = new Web3(process.env.RPC_URL);

const contractABI = require("./contractABI.json"); // Path to your ABI file

// The contract address of the deployed Verifier contract
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create the contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Controller function to verify the proof
const verifyProof = async (req, res) => {
  try {
    const { pi_a, pi_b, pi_c, publicSignals } = req.body;
    console.log(pi_a, pi_b, pi_c, publicSignals);
    // Get the account to send the transaction (from the private key)
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

    // Sign the transaction
    const tx = contract.methods.verifyProof(pi_a, pi_b, pi_c, publicSignals);
    const gasEstimate = await tx.estimateGas({ from: account.address });

    const txData = {
      from: account.address,
      to: contractAddress,
      data: tx.encodeABI(),
      gas: gasEstimate,
      gasPrice: web3.utils.toWei("5", "gwei"),
    };

    // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    if (receipt.status) {
      res.status(200).json({ success: true, message: "Proof verified successfully!" });
    } else {
      res.status(400).json({ success: false, message: "Proof verification failed!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { verifyProof };

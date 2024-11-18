const User = require('../models/User');
const { generateProof } = require('../services/zkProofService');

exports.receiveEHR = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'DID is missing' });
    }

    // Find the user by ID
    const user = await User.findOne({ did: id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const ehrData = user.ehrData;
    console.log('Fetched EHR data:', ehrData);

    // Ensure ehrData has the required properties
//    if (!ehrData || typeof ehrData.did === 'undefined' || typeof ehrData.conditionCode === 'undefined') {
//      return res.status(400).json({ success: false, message: 'EHR data is incomplete or invalid' });
//    }

    // Format the input data to match the expected format
    const inputData = {
      did: id,  // Ensure this matches the field in your database
      conditionCode: ehrData  // Ensure this matches the field in your database
    };

    // Generate the proof
    const proof = await generateProof(inputData);
    //res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', '*/*');
    return res.status(200).json({ success: true, proof });
  } catch (error) {
    console.error('Error fetching EHR data or generating proof:', error);
    res.status(500).json({ success: false, message: 'Error processing data' });
  }
};

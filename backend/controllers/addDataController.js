const User = require('../models/User');  // Import the User model

// Controller to add user data to the database
exports.addUserData = async (req, res) => {
  try {
    const { did, ehrData } = req.body; // Extract data from the request body
    console.log(did,ehrData);
    // Validate the input data
//    if (!did || !ehrData) {
//      return res.status(400).json({ message: "Both 'did' and 'ehrData' are required." });
//    }

    // Create a new user object
    const newUser = new User({
      did,
      ehrData
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    return res.status(201).json({ message: 'User data added successfully!', user: newUser });
  } catch (error) {
    // Handle errors
    console.error("Error adding user data:", error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

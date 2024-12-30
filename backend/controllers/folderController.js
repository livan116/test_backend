const Folder = require("../models/Folder");
const FormBot = require("../models/FormBot"); // Import FormBot model
const ShareableLink = require("../models/Share");
const { uuid } = require('uuidv4');

exports.createFolder = async (req, res) => {
  try {
    console.log("User:", req.user);
    const { name } = req.body;
    const userId = req.user.id; // Access userId correctly
    // Make sure user is authenticated

    console.log(userId);
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Folder name is required" });
    }

    // Create a new folder and assign it to the user
    const newFolder = new Folder({
      name,
      userId,
    });

    const savedFolder = await newFolder.save();

    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      folder: savedFolder,
    });
  } catch (error) {
    console.error("Error creating folder:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating folder",
    });
  }
};

// Create a form bot inside a folder
exports.createFormBot = async (req, res) => {
  const { folderId, formBotName, fields } = req.body;

  try {
    // Step 1: Find the folder by its ID
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }

    // Step 2: Validate fields
    if (!fields || fields.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Form fields are required" });
    }

    // Step 3: Ensure bubbles have data and input fields are left empty
    fields.forEach((field) => {
      if (field.type === 'bubble') {
        if (!field.value) {
          throw new Error('Bubble fields must have prefilled data.');
        }
      } else if (field.type === 'input') {
        field.value = '';  // Make sure input fields are empty for user to fill later
      }
    });

    // Step 4: Create the form bot
    const newFormBot = new FormBot({
      name: formBotName,
      fields,  // Save all fields (bubbles and inputs) to DB
    });

    // Step 5: Save the form bot
    const savedFormBot = await newFormBot.save();

    // Step 6: Add the form bot to the folder
    folder.formBots.push(savedFormBot._id);  // Associate the form bot with the folder
    await folder.save();

    res.status(201).json({
      success: true,
      message: 'Form bot created successfully',
      formBot: savedFormBot,
    });
  } catch (error) {
    console.error('Error creating form bot:', error.message);
    res.status(500).json({ success: false, message: 'Error creating form bot' });
  }
};



// Get all folders for a user
// copiolit fecth the folders

// ...existing code...

// Get all folders for a user
// copiolit fecth the folders

// exports.getFolders = async (req, res) => {
//   try {
//     console.log('User ID:', req.user.id);
//     const id = req.user.id;  // Access userId correctly
//     const folders = await Folder.findById(id);
//     console.log('Folders:', folders); // Log the fetched folders
//     res.status(200).json({ success: true, folders });
//   } catch (error) {
//     console.error('Error fetching folders:', error); // Log the error
//     res.status(500).json({ success: false, message: 'Error fetching folders' });
//   }
// };

exports.getFolders = async (req, res) => {
  try {
    // console.log(req.user.id);

    const output = await Folder.find({ userId: req.user.id });
    res.status(200).json({ success: true, output });
  } catch (error) {
    console.log(error);
  }
};


//getting forms by folder id



exports.getFormsByFolderId = async (req, res) => {
  const { folderId } = req.params; // Get the folder ID from the request params
  console.log('Folder ID:', folderId);
  try {
    // Step 1: Find the folder by ID
    const folder = await Folder.findById(folderId).populate('formBots'); // Populate formBots in the folder

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    // Step 2: Return the form bots associated with this folder
    res.status(200).json({
      success: true,
      forms: folder.formBots,  // All form bots associated with the folder
    });
  } catch (error) {
    console.error('Error fetching forms by folder ID:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
    });
  }
};


exports.getFormById = async (req, res) => {
  const { formId } = req.params; // Get formId from the request params
  
  try {
    // Find the form by formId
    const form = await FormBot.findById(formId);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    // Return the form data
    res.status(200).json({
      success: true,
      form,  // Send the form details in the response
    });
  } catch (error) {
    console.error('Error fetching form by formId:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching form details',
    });
  }
};




exports.updateFormById = async (req, res) => {
  const { formId } = req.params;  // Get formId from request params
  const { name, fields } = req.body; // Get form name and fields to be updated
  console.log('Form ID:', formId);
  try {
    // Step 1: Find the form by ID
    const form = await FormBot.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    // Step 2: Update form data
    form.name = name || form.name; // Update name if provided
    form.fields = fields;  // Update the fields (bubbles and inputs)

    // Step 3: Save the updated form
    await form.save();

    // Step 4: Respond with success
    res.status(200).json({
      success: true,
      message: 'Form updated successfully!',
      form: form,
    });
  } catch (error) {
    console.error('Error updating form:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating form',
    });
  }
};


exports.deleteFolderById = async (req, res) => {
  const { folderId } = req.params;

  try {
    // Find the folder to be deleted
    const folder = await Folder.findById(folderId);
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }

    // Delete all forms inside the folder before deleting the folder
    await FormBot.deleteMany({ folder: folderId });

    // Delete the folder
    await Folder.findByIdAndDelete(folderId);

    res.status(200).json({
      success: true,
      message: 'Folder and associated forms deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting folder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting folder',
    });
  }
};



// Delete Form by ID
exports.deleteFormById = async (req, res) => {
  const { formId } = req.params;

  try {
    // Find the form to be deleted
    const form = await FormBot.findById(formId);
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    // Remove the form from its folder's formBots array
    await Folder.findByIdAndUpdate(form.folder, { $pull: { formBots: formId } });

    // Delete the form from the database
    await FormBot.findByIdAndDelete(formId);

    res.status(200).json({
      success: true,
      message: 'Form deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting form:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting form',
    });
  }
};


// POST: /api/forms/generate-share-link
exports.shareForm =  async (req, res) => {
  const { formId } = req.body;

  try {
    // Find the form by formId
    const form = await FormBot.findById(formId);
    
    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    // Generate a unique link (can be a short unique ID)
    const shareableLinkId = uuid(); // A simple unique link identifier

    // Save shareable link and form reference
    const shareableLink = new ShareableLink({
      form: form._id,
      linkId: shareableLinkId,
    });

    await shareableLink.save();

    // Return the generated link
    res.json({
      success: true,
      link: `${req.protocol}://${req.get('host')}/form/${shareableLinkId}`, // The URL to be shared
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating shareable link." })
    console.log(error);
    }
};

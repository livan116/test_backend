const express = require('express');
const { createFolder, createFormBot, getFolders, getFormsByFolderId,updateFormById,deleteFolderById,deleteFormById ,shareForm } = require('../controllers/folderController');
const router = express.Router();
const auth = require('../middlewares/authMiddleware'); // Middleware for user authentication
const { getFormById } = require('../controllers/folderController');

// const { getFormsByFolderId } = require('../controllers/formController');

// Route to create a new folder
router.post('/create-folder', auth, createFolder);

// Route to create a form bot in a folder
router.post('/create-form-bot', auth, createFormBot);

// Route to get all folders of the user
router.get('/folders/:id', auth, getFolders);


// Define the route for fetching forms by folder ID
router.get('/folders/:folderId/forms',auth, getFormsByFolderId);

router.get('/form/:formId', getFormById);

router.put('/form/:formId', updateFormById);

router.delete('/folder/:folderId', deleteFolderById);
router.delete('/form/:formId', deleteFormById);

router.post('/generate-share-link',shareForm)


module.exports = router;

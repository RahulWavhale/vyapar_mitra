const express = require('express');
const { upload } = require('../middleware/uploadMiddleware');
const { registerUser, loginUser } = require('../controllers/user').default;
const router = express.Router();
router.post('/register', upload.fields([
    { name: 'samplePhotoUrl', maxCount: 1 },       // For suppliers (required)
    { name: 'documents.shopImgUrl', maxCount: 1 },          // For all users (optional)
    { name: 'documents.idProofUrl', maxCount: 1 }            // For suppliers (required)
]), registerUser);

router.post('/login', loginUser);

module.exports = router;

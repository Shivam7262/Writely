const express = require('express');
const {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/documents');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').get(protect, getDocuments).post(protect, createDocument);
router.route('/:id').get(protect, getDocument).put(protect, updateDocument).delete(protect, deleteDocument);

module.exports = router;
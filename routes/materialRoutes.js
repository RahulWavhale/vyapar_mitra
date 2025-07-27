const express = require('express');
const router = express.Router();
const protectHandler = require('../middleware/protectHandler');
const requireRole = require('../middleware/roleHandler');
const {
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');

router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.put('/:id', protectHandler, requireRole('supplier'), updateMaterial);
router.delete('/:id', protectHandler, requireRole('supplier'), deleteMaterial);

module.exports = router;

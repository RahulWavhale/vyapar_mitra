const Material = require('../models/Material');
const asyncHandler = require('../middleware/asyncHandler');


exports.getAllMaterials = asyncHandler(async (req, res) => {
  const materials = await Material.find().populate('supplierId', 'name');
  res.json(materials);
});

exports.getMaterialById = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id).populate('supplierId', 'name');
  if (!material) return res.status(404).json({ message: 'Material not found' });
  res.json(material);
});

//supplier only
exports.updateMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });

  if (material.supplierId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  Object.assign(material, req.body);
  await material.save();

  res.json(material);
});

//supplier only
exports.deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });

  if (material.supplierId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await material.remove();
  res.json({ message: 'Material deleted' });
});


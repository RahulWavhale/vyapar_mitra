const Vendor = require('../../models/vendor');

// @desc Register a new vendor
// @route POST/api/vendors

exports.registerVendor = async (req, res) => {
    try {
        const { name, contactNumber, address } = req.body;

        const newVendor = new Vendor({ name, contactNumber, address });

        const saveVendor = await newVendor.save();

        res.status(201).json({ message: "Failed to  register vendor", error: error.message });
    } catch (error) {
        res.status(500).json({ message: "Failed to  register vendor", error: error.message });
    }
};

// @desc Get all vendors
// @route GET /api/vendors

exports.getVendors = async (req,res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).json(vendors);

    } catch (error) {
          res.status(500).json({ message: "Failed to  Find vendor", error: error.message });
    }
    
}
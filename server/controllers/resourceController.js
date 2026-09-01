const ResourceUsage = require('../models/ResourceUsage');

// Get usage data for a specific resource, sorted by date
const getResourceUsage = async (req, res) => {
  try {
    const usage = await ResourceUsage.find({ resourceType: req.params.resourceType })
      .sort({ createdAt: 'asc' })
      .limit(20); // Get the last 20 data points
    res.json(usage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Log a new usage data point
const logResourceUsage = async (req, res) => {
  const { resourceType, usageValue, unit } = req.body;
  try {
    const newUsageLog = await ResourceUsage.create({ resourceType, usageValue, unit });
    res.status(201).json(newUsageLog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getResourceUsage, logResourceUsage };

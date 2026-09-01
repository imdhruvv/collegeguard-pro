const User = require('../models/User');
const { Parser } = require('json2csv');

const exportUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').lean();
    
    const fields = ['_id', 'name', 'email', 'role', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(users);

    res.header('Content-Type', 'text/csv');
    res.attachment('users-report.csv');
    res.send(csv);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { exportUsers };

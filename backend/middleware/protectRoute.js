import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protectRoute = async (req, res, next) => {
  try {
    // 1. Get the token from the request
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    // 2. Check if the token exists
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user based on the decoded token
    const user = await User.findById(decoded.userId).select('-password');

    // 5. Attach the user to the request object
    req.user = user;

    // 6. Call the next middleware
    next();
  } catch (error) {
    // 7. Handle errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

export default protectRoute;
import jwt from 'jsonwebtoken';

// 1. Verify ADMIN Role
export const verifyAdmin = (req, res, next) => {
  const token = req.session.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// 2. Verify STUDENT Role
export const verifyStudent = (req, res, next) => {
  const token = req.session.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    // Allow STUDENT and ADMIN
    if (decoded.role !== 'STUDENT' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden. Student access required.' });
    }
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// 3. 🔥 ADDED: Verify FACULTY Role (Fixes your SyntaxError)
export const verifyFaculty = (req, res, next) => {
  const token = req.session.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    // Allow FACULTY and ADMIN
    if (decoded.role !== 'FACULTY' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden. Faculty access required.' });
    }
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};
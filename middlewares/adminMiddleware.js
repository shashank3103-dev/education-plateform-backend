module.exports = (req, res, next) => {
  // First verify user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Then check admin status (neither student nor tutor)
  if (req.user.student || req.user.tutor) {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'Only platform administrators can access this resource' 
    });
  }
  if (!req.user.is_verified) {
    return res.status(403).json({ 
      error: 'Account not verified',
      message: 'Your account must be verified to access admin resources' 
    });
  }

  
  
  next();
};
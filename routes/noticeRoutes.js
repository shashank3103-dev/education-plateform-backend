const express = require('express');
const noticeController = require('../controllers/noticeController');
const authenticateToken = require('../middlewares/authMiddleware'); 
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();



// POST /notices/create
router.post('/create',authenticateToken,adminMiddleware ,noticeController.createNotice);

// GET /notices/get/:id
router.get('/get/:id',authenticateToken,adminMiddleware ,noticeController.getNoticeById);

// GET /notices/searchbystatus
router.get('/searchbystatus/:status',authenticateToken,adminMiddleware ,noticeController.searchByStatus);



// PUT /notices/update/:id
router.put('/update/:id',authenticateToken,adminMiddleware ,noticeController.updateNotice);

// DELETE /notices/delete/:id
router.delete('/delete/:id',authenticateToken,adminMiddleware ,noticeController.deleteNotice);

module.exports = router;


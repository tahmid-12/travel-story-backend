import express from 'express';
import { upload } from '../utils/multer';
import { authenticateToken } from '../utils/validators';
import { imageUpload, imageDelete } from '../controllers/imageController';

const router = express.Router();

router.post('/upload-image', authenticateToken, upload.single('image'), imageUpload);
router.delete('/delete-image', authenticateToken, imageDelete);

export default router;
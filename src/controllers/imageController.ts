import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { __dirname as multerDirname } from '../utils/multer';

interface CustomRequest extends Request {
  file: Express.Multer.File;
}

export const imageUpload = async (req:  CustomRequest, res: Response): Promise<Response> => {
    try{
        if(!req.file){
            return res.status(400).json({
                message: "Please upload an image"
            });
        }

        const imageUrl = `http://localhost:5000/src/uploads/${req.file.filename}`;
        
        return res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl
        });
    }catch(error){
        return res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}

export const imageDelete = async (req: CustomRequest, res: Response): Promise<Response> => {
    const { imageName } = req.body;

    if (!imageName) {
        return res.status(400).json({
            message: "Image name is required"
        });
    }

     const fileName = imageName.split('/').pop();

    if (!fileName) {
        return res.status(400).json({
            message: "Invalid image name"
        });
    }

    try {
        const imagePath = path.join(multerDirname, '../uploads', fileName);
        
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                message: "Image not found"
            });
        }else {
            fs.unlinkSync(imagePath);
            return res.status(200).json({ 
                message: "Image deleted successfully"
            });
        }
    } catch(error) {
        return res.status(500).json({
            message: "Error deleting image",
            error: error
        });
    }
}
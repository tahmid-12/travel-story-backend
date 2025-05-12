import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

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
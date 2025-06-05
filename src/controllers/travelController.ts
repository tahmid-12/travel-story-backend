import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import TravelStory from '../models/travelStory.model';
import { __dirname as multerDirname } from '../utils/multer';

export const addTravelStory = async (req: Request, res: Response): Promise<Response> => {
    
    const { title, story, visitedLocation, isFavourite, imageUrl, visitedDate } = req.body;


    const { id: userId } = (req as any).user;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!story) missingFields.push("story");
    if (!imageUrl) missingFields.push("imageUrl");
    if (!visitedLocation || visitedLocation.length === 0) missingFields.push("visitedLocation");
    if (!visitedDate) missingFields.push("visitedDate");

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Please fill all the required fields",
            missingFields,
        });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        const travelStory =  new TravelStory({
            title,
            story,
            visitedLocation,
            isFavourite,
            imageUrl,
            visitedDate: parsedVisitedDate,
            userId
        });

        await travelStory.save();
        return res.status(201).json({
            message: "Travel story added successfully",
            story: travelStory
        });
    }catch(err){
        return res.status(400).json({ error: err, message: "Something went wrong" });
    }
}

export const getAllTravelStories = async (req: Request, res: Response): Promise<Response> => {

    const { id: userId } = (req as any).user;
    try {
        const travelStories = await TravelStory.find({ userId }).sort({ isFavourite: -1 });
        return res.status(200).json({
            message: "Travel stories fetched successfully",
            travelStories
        });
    } catch (err) {
        return res.status(500).json({ error: err, message: "Something went wrong" });
    }

}

export const editTravelStory = async (req: Request, res: Response): Promise<Response> => {
    const { storyId } = req.params;
    const { id } = (req as any).user;

    const updateFields: any = {};

    if (req.body.title !== undefined) updateFields.title = req.body.title;
    if (req.body.story !== undefined) updateFields.story = req.body.story;
    if (req.body.visitedLocation !== undefined) updateFields.visitedLocation = req.body.visitedLocation;
    if (req.body.isFavourite !== undefined) updateFields.isFavourite = req.body.isFavourite;
    if (req.body.imageUrl !== undefined) updateFields.imageUrl = req.body.imageUrl;
    if (req.body.visitedDate !== undefined) {
        updateFields.visitedDate = new Date(req.body.visitedDate);
    }

    try {
        const updatedStory = await TravelStory.findOneAndUpdate(
            { _id: storyId, userId: id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedStory) {
            return res.status(404).json({
                message: "Travel story not found or you do not have permission to edit it"
            });
        }

        return res.status(200).json({
            message: "Travel story updated successfully",
            story: updatedStory
        });

    } catch (err) {
        return res.status(500).json({ error: err, message: "Something went wrong" });
    }
};

export const deleteTravelStory = async (req: Request, res: Response): Promise<Response> => {
    const { storyId } = req.params;
    const { id: userId } = (req as any).user;

    try {
        const deletedStory = await TravelStory.findOneAndDelete({ _id: storyId, userId });

        if (!deletedStory) {
            return res.status(404).json({
                message: "Travel story not found or you do not have permission to delete it"
            });
        }

        const imageUrl = deletedStory.imageUrl;
        const fileName = path.basename(imageUrl);

        const imagePath = path.join(multerDirname, '../uploads', fileName);


        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting image file:", err);
            } else {
                console.log("Image file deleted successfully:", imagePath);
            }
        })

        return res.status(200).json({
            message: "Travel story deleted successfully",
            story: deletedStory
        });

    } catch (err) {
        return res.status(500).json({ error: err, message: "Something went wrong" });
    }   
}

export const isTraveFavourite = async (req: Request, res: Response): Promise<Response> => {
    const { storyId } = req.params;
    const { isFavourite } = req.body;
    const { id: userId } = (req as any).user;

    try {
        const travelStory = await TravelStory.findOne({ _id: storyId, userId });

        if (!travelStory) {
            return res.status(404).json({
                message: "Travel story not found or you do not have permission to access it"
            });
        }

        travelStory.isFavourite = isFavourite;
        await travelStory.save();

        return res.status(200).json({
            message: "Travel story favourite status updated successfully",
            isFavourite: travelStory.isFavourite
        });

    } catch (err) {
        return res.status(500).json({ error: err, message: "Something went wrong" });
    }   
}

export const searchTravelStories = async (req: Request, res: Response): Promise<Response> => {
    const { query } = req.query;
    // console.log("Search query:", query);
    const { id: userId } = (req as any).user;

    if(!query) {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        const travelStories = await TravelStory.find({
            userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { story: { $regex: query, $options: 'i' } },
                { visitedLocation: { $regex: query, $options: 'i' } }
            ]
        }).sort({ isFavourite: -1 });

        return res.status(200).json({
            message: "Search results fetched successfully",
            travelStories
        });
    } catch (err) {
        return res.status(500).json({ error: err, message: "Something went wrong" });
    }
}
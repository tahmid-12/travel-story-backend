import { Request, Response } from 'express';
import TravelStory from '../models/travelStory.model';

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
    const { title, story, visitedLocation, isFavourite, imageUrl, visitedDate } = req.body;
    const { id } = (req as any).user;

    if (!title || !story || !imageUrl || !visitedLocation || !visitedDate) {
        return res.status(400).json({
            message: "Please fill all the required fields",
        });
    }

    const parsedVisitedDate = new Date(visitedDate);

    try {
        // const updatedStory = await TravelStory.findOneAndUpdate({ storyId });
        const updatedStory = await TravelStory.findOneAndUpdate(
            { _id: storyId, userId: id },
            {
                title,
                story,
                visitedLocation,
                isFavourite,
                imageUrl,
                userId: id,
                visitedDate: parsedVisitedDate
            },
            { new: true }
        );

        console.log("UPDATED STORY", updatedStory);

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
}
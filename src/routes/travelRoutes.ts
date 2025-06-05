import express from 'express';
import { addTravelStory,getAllTravelStories,editTravelStory,deleteTravelStory } from '../controllers/travelController';
import { authenticateToken } from '../utils/validators';

const router = express.Router();

router.post("/add-travel-story", authenticateToken, addTravelStory);
router.get("/get-all-stories", authenticateToken, getAllTravelStories);
router.put("/edit-travel-story/:storyId",authenticateToken,editTravelStory);
router.delete("/delete-travel-story/:storyId",authenticateToken,deleteTravelStory);

export default router;
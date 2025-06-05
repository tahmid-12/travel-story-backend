import express from 'express';
import { addTravelStory,getAllTravelStories,editTravelStory,deleteTravelStory,isTraveFavourite,searchTravelStories } from '../controllers/travelController';
import { authenticateToken } from '../utils/validators';

const router = express.Router();

router.post("/add-travel-story", authenticateToken, addTravelStory);
router.get("/get-all-stories", authenticateToken, getAllTravelStories);
router.get("/search-travel-stories", authenticateToken, searchTravelStories);
router.put("/edit-travel-story/:storyId",authenticateToken,editTravelStory);
router.put("/is-travel-favourite/:storyId",authenticateToken,isTraveFavourite);
router.delete("/delete-travel-story/:storyId",authenticateToken,deleteTravelStory);

export default router;
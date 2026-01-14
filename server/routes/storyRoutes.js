import express from "express";
import { addUSerStory, getStories } from "../controllers/storyController.js";
import { upload } from "../configs/multer.js";
import { protect } from "../middlewares/auth.js";
const storyRouter = express.Router();

storyRouter.post("/create", upload.single('media'), protect, addUSerStory);
storyRouter.get("/get", protect, getStories);

export default storyRouter;
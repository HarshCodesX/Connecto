import express from "express";
import { addUSerStory, getStories } from "../controllers/storyController.js";
const storyRouter = express.Router();

storyRouter.post("/create",XMLHttpRequestUpload.single('media'), protect, addUSerStory);
storyRouter.get("/get", protect, getStories);

export default storyRouter;
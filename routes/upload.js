import Router from "express";
const router = Router();
import { uploadFileMiddleware } from "../middleware/index.js";
import { allFiles } from "../common/array_for_files.js";

router
  .route("/")
  .get((req, res) => {
    res.render("file", { title: "File Page" });
  })
  .post(uploadFileMiddleware);

router.get("/list", (req, res) => {
  res.render("list", { title: "List Page", allFiles });
});

export default router;

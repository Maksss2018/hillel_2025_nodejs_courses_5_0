import Router from "express";
const router = Router();

router.get("/", (req, res) => {
  res.render("main", { title: "Home Page" });
});

export default router;

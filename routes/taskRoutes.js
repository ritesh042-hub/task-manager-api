const router = require("express").Router();
const { body } = require("express-validator");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createTask, getTasks, getTask, updateTask, deleteTask
} = require("../controllers/taskController");

router.use(protect);

router.post(
  "/",
  [
    body("title").isString().trim().isLength({ min: 1, max: 120 }).withMessage("Title is required (max 120 characters)"),
    body("description").optional().isString().isLength({ max: 1000 }).withMessage("Description must be 1000 characters or fewer"),
    body("status").optional().isIn(["pending", "in-progress", "completed"]).withMessage("Invalid task status")
  ],
  validate,
  createTask
);

router.get("/", getTasks);
router.get("/:id", getTask);

router.put(
  "/:id",
  [
    body().custom((value) => Object.keys(value).some((key) => ["title", "description", "status"].includes(key)))
      .withMessage("Provide at least one field to update"),
    body("title").optional().isString().trim().isLength({ min: 1, max: 120 }).withMessage("Title must be 1-120 characters"),
    body("description").optional().isString().isLength({ max: 1000 }).withMessage("Description must be 1000 characters or fewer"),
    body("status").optional().isIn(["pending", "in-progress", "completed"]).withMessage("Invalid task status")
  ],
  validate,
  updateTask
);

router.delete("/:id", deleteTask);

module.exports = router;
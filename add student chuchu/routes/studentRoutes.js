const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/", studentController.renderAllStudents);

router.get("/new", studentController.renderCreateForm);

router.post("/", studentController.createStudentFromForm);

router.get("/:id", studentController.renderStudentDetails);

router.get("/:id/edit", studentController.renderEditForm);

router.post("/:id", studentController.updateStudentFromForm);

router.post("/:id/delete", studentController.deleteStudentFromForm);

module.exports = router;

const StudentModel = require("../models/Student");

exports.renderAllStudents = async (req, res) => {
  try {
    const search = req.query.search || "";
    const sortField = req.query.sort || "name";
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },
      ],
    };

    const totalStudents = await StudentModel.countDocuments(query);

    const students = await StudentModel.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.render("index", {
      students,
      search,
      sortField,
      sortOrder,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
    });
  } catch (err) {
    console.error("renderAllStudents Error:", err);
    res.status(500).send("Server Error");
  }
};

exports.renderCreateForm = (req, res) => {
  res.render("create", { errors: [], old: {} });
};

exports.createStudentFromForm = async (req, res) => {
  try {
    const { name, age, course, email } = req.body;

    const errors = [];

    if (!name || name.trim() === "") errors.push("Name is required");
    if (!age || age <= 0) errors.push("Valid age is required");
    if (!course || course.trim() === "") errors.push("Course is required");
    if (!email || !email.includes("@")) errors.push("Valid email is required");

    if (errors.length > 0) {
      return res.render("create", { errors, old: req.body });
    }

    await StudentModel.create({ name, age, course, email });

    res.redirect("/students");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.renderStudentDetails = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) return res.status(404).send("Student not found");

    res.render("show", { student });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.renderEditForm = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) return res.status(404).send("Student not found");

    // Always pass `errors` array to the template
    res.render("edit", { student, errors: [] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateStudentFromForm = async (req, res) => {
  try {
    const { name, age, course, email } = req.body;
    const student = await StudentModel.findById(req.params.id);

    if (!student) return res.status(404).send("Student not found");

    const errors = [];
    const validCourses = [
      "BSIT",
      "BSCS",
      "BSEE",
      "BSCE",
      "BSARCHI",
      "BSMATH",
      "BCED",
    ];

    if (!name || name.trim() === "") errors.push("Name is required");
    if (!age || age <= 0) errors.push("Valid age is required");
    if (!course || !validCourses.includes(course))
      errors.push("Please select a valid course");
    if (!email || !email.includes("@")) errors.push("Valid email is required");

    if (errors.length > 0) {
      return res.render("edit", {
        student: { _id: student._id, ...req.body },
        errors,
      });
    }

    student.name = name;
    student.age = age;
    student.course = course;
    student.email = email;
    await student.save();

    res.redirect("/students");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteStudentFromForm = async (req, res) => {
  try {
    await StudentModel.findByIdAndDelete(req.params.id);
    res.redirect("/students");
  } catch (err) {
    res.status(500).send("Error deleting student");
  }
};

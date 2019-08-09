const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/lecturer/register-lecturer");
const validateLoginInput = require("../../validation/lecturer/login-lecturer");

// Load Lecturer model
const Lecturer = require("../../models/Lecturer");

/**
 * @route   GET api/lecturers/test
 * @desc    Tests lecturers route
 * @access  Public
 */

router.get("/test", (req, res) => res.json({ msg: "Lecturers Works" }));

/**
 * @route   POST api/lecturers/register
 * @desc    Register lecturers
 * @access  Public
 */
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Lecturer.findOne({ email: req.body.email }).then(lecturer => {
    if (lecturer) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newLecturer = new Lecturer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        matrixID: req.body.matrixID,
        email: req.body.email,
        password: req.body.password
        //avatar: ,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newLecturer.password, salt, (err, hash) => {
          if (err) throw err;
          newLecturer.password = hash;
          newLecturer
            .save()
            .then(lecturer => res.json(lecturer))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

/**
 * @route   POST api/lecturers/login
 * @desc    Login lecturers / Returning JWT Token
 * @access  Public
 */
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find lecturer by email
  Lecturer.findOne({ email }).then(lecturer => {
    // Check for lecturer
    if (!lecturer) {
      errors.email = "Account not found";
      return res.status(400).json(errors);
    }

    // Check Password
    bcrypt.compare(password, lecturer.password).then(isMatch => {
      if (isMatch) {
        // Lecturer Matched
        // Create JWT Payload
        const payload = { id: lecturer.id, name: lecturer.firstname };

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

/**
 * @route   GET api/lecturers/current
 * @desc    Return current lecturer
 * @access  Private
 */
router.get(
  "/current-lecturer",
  passport.authenticate("lecturer-rule", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      matrixID: req.user.matrixID,
      email: req.user.email
    });
  }
);

module.exports = router;

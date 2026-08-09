const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    getCurrentUser
} = require("../controllers/user.controller");

router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

module.exports = router;
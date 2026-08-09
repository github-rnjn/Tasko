const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");

const {
    getProfile,
    updateProfile,
    changePassword,
    updateAvatar
} = require("../controllers/profile.controller");

const upload =
    require("../middlewares/upload.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProfile);

router.patch(
    "/",
    updateProfile
);

router.patch(
    "/change-password",
    changePassword
);

router.patch(
    "/avatar",
    upload.single("avatar"),
    updateAvatar
);

module.exports = router;
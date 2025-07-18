const Banner = require("../models/Banner");
const fs = require("fs");
const path = require("path");

// Add banner
exports.addBanner = async (req, res) => {
  try {
    if (!req.user.admin) return res.status(403).json({ error: "Admin only" });

    const { screen } = req.body;
    // let images = req.files ? req.files.map((f) => f.filename) : [];

    // if (!screen || images.length === 0)
    //   return res
    //     .status(400)
    //     .json({ error: "Screen and at least 1 image required" });
    // if (images.length > 5)
    //   return res.status(400).json({ error: "Max 5 images allowed" });
    if (!req.files || !req.files["images"]) {
      return res.status(400).json({ message: "No Image was uploaded." });
    }
    const profileImage = path.join("uploads", req.files["images"][0].filename);
    // console.log(profileImage)
    const baseUrl = process.env.BASE_URL;
    const services_icon = `${baseUrl}${profileImage.replace(/\\/g, "/")}`;

    const banner = await Banner.create({ screen, images: services_icon });
    res.status(201).json({ message: "Banner created", banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }cht
};
// exports.addBanner = async (req, res) => {
//   try {
//     if (!req.user.admin) return res.status(403).json({ error: "Admin only" });
//     const { screen } = req.body;
//     if (
//       !req.files ||
//       !req.files["images"] ||
//       req.files["images"].length === 0
//     ) {
//       return res
//         .status(400)
//         .json({ message: "At least one image is required." });
//     }

//     const baseUrl = process.env.BASE_URL;

//     // Create an array of image URLs
//     const imageUrls = req.files["images"].map((file) =>
//       `${baseUrl}uploads/${file.filename}`.replace(/\\/g, "/")
//     );

//     // Check for image count constraint
//     if (imageUrls.length > 5) {
//       return res.status(400).json({ error: "You can add up to 5 images only" });
//     }

//     // Save to DB
//     const banner = await Banner.create({
//       screen,
//       images: imageUrls, // array of image URLs
//     });

//     res.status(201).json({ message: "Banner created", banner });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// Update banner
exports.updateBanner = async (req, res) => {
  try {
    if (!req.user.admin) return res.status(403).json({ error: "Admin only" });

    const { bannerId } = req.params;
    const { screen } = req.body;
    let images = req.files ? req.files.map((f) => f.filename) : [];

    const banner = await Banner.findByPk(bannerId);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    if (images.length > 5)
      return res.status(400).json({ error: "Max 5 images allowed" });

    // Optionally, delete old images from disk if you want

    banner.screen = screen || banner.screen;
    if (images.length > 0) banner.images = images;
    await banner.save();

    res.status(200).json({ message: "Banner updated", banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove banner
exports.removeBanner = async (req, res) => {
  try {
    if (!req.user.admin) return res.status(403).json({ error: "Admin only" });

    const { bannerId } = req.params;
    const banner = await Banner.findByPk(bannerId);
    if (!banner) return res.status(404).json({ error: "Banner not found" });

    // Optionally, delete images from disk here

    await banner.destroy();
    res.status(200).json({ message: "Banner removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll();
    res.status(200).json({ banners });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get banner by id
exports.getBannerById = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const banner = await Banner.findByPk(bannerId);
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    res.status(200).json({ banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

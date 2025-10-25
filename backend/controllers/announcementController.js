import Announcement from "../models/Announcement.js";

// all announcements
export const getAnnouncements = async (req, res) => {
  try {
    const { course, priority, isActive } = req.query;

    const query = {};
    if (course) query.course = course;
    if (priority) query.priority = priority;
    if (isActive !== undefined) query.isActive = isActive === "true";

    if (req.user?.role === "student") {
      query.isActive = true;
      query.$or = [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: new Date() } },
      ];
    }

    const announcements = await Announcement.find(query)
      .populate("createdBy", "username email")
      .sort({ publishDate: -1 });

    res.status(200).json({
      status: "success",
      results: announcements.length,
      data: { announcements },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ====================== Get Single Announcement ======================
export const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );

    if (!announcement) {
      return res.status(404).json({
        status: "error",
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { announcement },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ====================== Create Announcement ======================
export const createAnnouncement = async (req, res) => {
  try {
    req.body.createdBy = req.user?._id;

    const announcement = await Announcement.create(req.body);

    res.status(201).json({
      status: "success",
      data: { announcement },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ====================== Update Announcement ======================
export const updateAnnouncement = async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        status: "error",
        message: "Announcement not found",
      });
    }

    if (
      announcement.createdBy.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this announcement",
      });
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: { announcement },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// ====================== Delete Announcement ======================
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        status: "error",
        message: "Announcement not found",
      });
    }

    if (
      announcement.createdBy.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this announcement",
      });
    }

    await announcement.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

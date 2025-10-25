import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      
    },
    content: {
      type: String,
      required: [true, "content is required"],
      trim: true,
       
    },
    course: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "Priority must be: low, medium, high, or urgent",
      },
      default: "medium",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function (value) {
      
          return !value || value > this.publishDate;
        },
        
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,  
  }
);

// for speed search operation  
AnnouncementSchema.index({ course: 1, publishDate: -1 });
AnnouncementSchema.index({ isActive: 1, expiryDate: 1 });

const Announcement = mongoose.model("Announcement", AnnouncementSchema);
export default Announcement;

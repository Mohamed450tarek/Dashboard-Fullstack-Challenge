import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'essay'],  
    default: 'mcq',
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
 
  options: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
     // for true and false q 
        if (this.type === 'mcq') {
          return Array.isArray(v) && v.length >= 2;
        }
        return true;  
      },
      message: 'MCQ questions must have at least 2 options',
    },
  },

  correctAnswer: {
    type: Number,
    validate: {
      validator: function (v) {
        if (this.type === 'mcq') {
          return v !== undefined && v >= 0;
        }
        return true;
      },
      message: 'MCQ questions must have a correct answer index',
    },
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: 1,
    default: 1,
  },
});

 
const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    course: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    questions: {
  type: [QuestionSchema],
  required: true,
  default: [],
  validate: {
    validator: function (v) {
      return Array.isArray(v) && v.length > 0;
    },
    message: "At least one question is required",
  },
},

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [5, "at leat 5 minutes"],
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
 // calculation total point 
QuizSchema.pre("save", function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );
  }
  next();
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz; 

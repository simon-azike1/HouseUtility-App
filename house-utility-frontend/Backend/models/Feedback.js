import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Household'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    page: {
      type: String,
      trim: true,
      maxlength: 200
    },
    country: {
      type: String,
      trim: true,
      maxlength: 100
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: 300
    },
    surveyOptions: [{
      type: String,
      trim: true
    }],
    feedbackType: {
      type: String,
      enum: ['general', 'survey'],
      default: 'general'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', FeedbackSchema);

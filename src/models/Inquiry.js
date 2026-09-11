import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    inquiryId: {
      type: String,
      unique: true,
      required: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone/WhatsApp number is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
    },
    budgetRange: {
      type: String,
      required: [true, 'Budget range is required'],
    },
    timeline: {
      type: String,
      required: [true, 'Timeline is required'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    footageLink: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'contacted', 'archived'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in Next.js hot-reloading
export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

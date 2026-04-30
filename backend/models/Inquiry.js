import mongoose from 'mongoose';

export const INQUIRY_TYPES    = ['GENERAL', 'PROPERTY'];
export const INQUIRY_STATUSES = ['PENDING', 'REPLIED', 'CLOSED'];

const inquirySchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User',     required: true, index: true },
    propertyId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null,  index: true },
    inquiryType: { type: String, enum: INQUIRY_TYPES,    required: true,  index: true },
    title:       { type: String, required: true },
    message:     { type: String, required: true },
    status:      { type: String, enum: INQUIRY_STATUSES, required: true,  default: 'PENDING', index: true },
    adminReply:  { type: String },
    repliedAt:   { type: Date },
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: 1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
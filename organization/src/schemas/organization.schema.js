import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    employees: { type: String },
    industry: { type: String },
    features: { type: Array },
    logo: { type: String },
    mobile: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const Organization = mongoose.model('Organization', organizationSchema);

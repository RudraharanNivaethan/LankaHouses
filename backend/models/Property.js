import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title:         { type: String, required: true },
    price:         { type: Number, required: true },
    type:          { type: String, enum: ['Apartment', 'HouseWithLand', 'Villa'] },
    listingType:   { type: String, enum: ['sale', 'rent'], default: 'sale' },
    bedrooms:      { type: Number },
    bathrooms:     { type: Number },
    garage:        { type: Boolean, default: false },
    area:          { type: Number },
    landSize:      { type: Number },
    address:       { type: String },
    district:      { type: String, index: true },
    province:      { type: String, index: true },
    description:   { type: String },
    images:        [{ type: String }],
    contactNumber: { type: String, required: true },
    status:        { type: String, enum: ['active', 'sold', 'removed'], default: 'active' },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;

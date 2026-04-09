import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title:         { type: String, required: true },
    price:         { type: Number, required: true, index: true },
    type:          { type: String, enum: ['Apartment', 'House', 'Villa'], required: true },
    listingType:   { type: String, enum: ['sale', 'rent'], required: true, index: true },
    bedrooms:      { type: Number, required: true },
    bathrooms:     { type: Number, required: true },
    parkingSpaces: { type: Number, required: true },
    furnished:     { type: Boolean, default: false, required: true },
    yearBuilt:     { type: Number, required: true },
    noOfFloors:    { type: Number, required: true },
    area:          { type: Number, required: true },
    landSize:      { type: Number, required: true },
    address:       { type: String, required: true },
    district:      { type: String, index: true, required: true },
    province:      { type: String, index: true, required: true },
    description:   { type: String, required: true },
    images: { type: [String], required: true},
    contactNumber: { type: String, required: true },
    status:        { type: String, enum: ['active', 'sold', 'removed'], default: 'active', required: true },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;

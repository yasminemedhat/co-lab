const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//enums
//Fields
const HireFields = Object.freeze({
    PAINTING: "Painting",
    COOKING: "Cooking",
    PHOTOGRAPHY: "Photography",
    FASHION: "Fashion Design",
    TUTORING:"Tutoring",
    FILM:"Film Making",
    TRANSLATING:"Translating",
    WAITERING: "Waitering",
    
  });

//schema
const QuickHireSchema = new Schema({
    title:          {   type: String, required: true, trim: true},
    description:    {   type: String},
    field:          {   type: String, enum: Object.values(HireFields)},
    employer:       {   type: Schema.Types.ObjectId, ref: 'Colaber'},
    employee:       {   type: Schema.Types.ObjectId, ref: 'Colaber'},
    money:          {   type: Number},
    date:           {   type: Date, required: true},
    availability:   {   type: Boolean, default: true},
    createdAt:      {   type: Date, default: Date.now}
});

Object.assign(QuickHireSchema.statics, {
    HireFields
  });

module.exports = mongoose.model('QuickHire', QuickHireSchema);
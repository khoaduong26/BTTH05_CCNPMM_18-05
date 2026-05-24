const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['PERCENT', 'AMOUNT'], default: 'PERCENT' },
    value: { type: Number, required: true, min: 0 },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Discount', discountSchema);

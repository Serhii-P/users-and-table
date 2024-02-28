const { Schema, models, model } = require("mongoose");

const EntrySchema = new Schema(
  {
    rowId: { type: String, required: true },
    id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    birthday: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    userEmail: { type: String, required: true, unique: true },
    entries: [EntrySchema],
  },
  { timestamps: true }
);

export const User = models?.User || model("User", UserSchema);

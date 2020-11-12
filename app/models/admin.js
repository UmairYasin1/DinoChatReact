const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminSchema = new Schema({
  admin_id: { type: String, default: "", required: true },
  admin_name: { type: String, default: "", required: true },
  admin_email: { type: String, default: "", required: true },
  admin_phone: { type: String, default: "" },
  admin_password: { type: String, default: "", required: true },
  admin_status: { type: String, default: "" },
  admin_ip: { type: String, default: "" },
  role : { type: String, default: "", required: true },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});
mongoose.model("AdminSchema", adminSchema);

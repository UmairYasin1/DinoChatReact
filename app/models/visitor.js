const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const visitorSchema = new Schema({
  visitor_id: { type: String, default: "", required: true },
  visitor_name: { type: String, default: "", required: true },
  visitor_email: { type: String, default: "", required: true },
  phone_number: { type: String, default: "", required: false },
  company_name: { type: String, default: "" },
  number_of_employees: { type: String, default: "" },
  visitor_publicIp: { type: String, default: "" },
  visitor_privateIp: { type: String, default: "" },
  role : { type: String, default: "", required: false },
  visitor_region_publicIp: [],
  visitor_region_privateIp: [],
  visitor_browser_and_os: [],
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});
mongoose.model("VisitorSchema", visitorSchema);

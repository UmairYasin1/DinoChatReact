const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;
const roleSchema = new Schema({
  role_id: { type: String, default: "", required: true },
  role_name: { type: String, default: "", required: true },
  createdOn: { type: Date, default: Date.now }
});

mongoose.model("RoleSchema", roleSchema);

const roleModel = mongoose.model("RoleSchema", roleSchema);


const AdminRole = new roleModel({
  role_id: shortid.generate(),
  role_name: 'ROLE_ADMIN',
  createdOn: Date.now()
});

const AgentRole = new roleModel({
  role_id: shortid.generate(),
  role_name: 'ROLE_AGENT',
  createdOn: Date.now()
});

const VisitorRole = new roleModel({
  role_id: shortid.generate(),
  role_name: 'ROLE_VISITOR',
  createdOn: Date.now()
});

roleModel.findOne(
  { $and: [{ role_name: 'ROLE_ADMIN' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      AdminRole.save();
    } 
  }
);

roleModel.findOne(
  { $and: [{ role_name: 'ROLE_AGENT' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      AgentRole.save();
    } 
  }
);

roleModel.findOne(
  { $and: [{ role_name: 'ROLE_VISITOR' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      VisitorRole.save();
    } 
  }
);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const agentSchema = new Schema({
  agent_id: { type: String, default: "", required: true },
  agent_name: { type: String, default: "", required: true },
  agent_email: { type: String, default: "", required: true },
  agent_phone: { type: String, default: "", required: false },
  agent_password: { type: String, default: "", required: true },
  agent_status: { type: Boolean, default: true, required: true },
  agent_ip: { type: String, default: "", required: false },
  role : { type: String, default: "", required: false },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});
mongoose.model("AgentSchema", agentSchema);

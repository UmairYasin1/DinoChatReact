const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");

const encrypt = require("../../libs/encrypt.js");

const router = express.Router();

const agentModel = mongoose.model("AgentSchema");
const roleModel = mongoose.model("RoleSchema");

var getRoleNameFromDbValue;

module.exports.controller = function(app) {
    
    //api to create agent
    router.post("/api/v1/agentSignup", function(
      req,
      res
    ) {
    
      const today = Date.now();
      const id = shortid.generate();
      const epass = encrypt.encryptPassword(req.body.password);

      Promise.resolve(getRoleNameFromDb);
    
      console.log(getRoleNameFromDbValue);
      
      //create user.
      const newAgent = new agentModel({
        agent_id: id,
        agent_name: req.body.username,
        agent_email: req.body.email,
        role: getRoleNameFromDbValue, 
        agent_password: epass,
        createdOn: today,
        updatedOn: today
      });
  
      newAgent.save(function(err, result) {
        if (err) {
          res.status(500).send('Some Error Occured During Creation. Detail: ' +  err);
        } else if (result == undefined || result == null || result == "") {
          res.status(404).send('User Is Not Created. Please Try Again.');
        } else {
          req.agent = result;
          delete req.agent.password;
          req.session.agent = result;
          delete req.session.agent.password;
          res.status(200).send('Agent has been created');
        }
      });
    });

    router.post("/api/v1/agentLogin", function(req, res) {
      const epass = encrypt.encryptPassword(req.body.password);
      const token = Buffer.from(`${req.body.email}:${req.body.password}`, 'utf8').toString('base64');
     
      agentModel.findOne(
        { $and: [{ agent_email: req.body.email }, { agent_password: epass }] },
        function(err, result) {
          if (err) {
            res.status(500).send('Some Error Occured During Login.');
          } else if (result == null || result == undefined || result == "") {
            res.status(404).send('User Not Found. Please Check Your Username and Password.');
          } else {
            req.agent = result;
            delete req.agent.password;
            req.session.agent = result;
            delete req.session.agent.password;
            res.status(200).send({ 
              agent: req.session.agent,
              email: req.body.email, 
              accessToken : token,
              roles : result.role
            });
          }
        }
      );
    });

    router.get("/agentDashboard", function(req, res) {
      if(req.session.agent == undefined){
        res.status(500).send('Please login');
      }
      else{
        res.status(200).send({ 
          agent: req.session.agent
        });
      }
    });

    var getRoleNameFromDb = (async () => {
      roleModel.findOne({ $and: [{ role_name : "ROLE_AGENT"}] }, function(err, data){
        if(err){
          return err;
        }
        getRoleNameFromDbValue = data.role_name;
        return data;
      });
    })();

    app.use("/agent", router);
  }; 
  
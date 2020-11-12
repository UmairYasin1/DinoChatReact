const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
// var geoip = require('geoip-lite');
// const publicIp = require('public-ip');


const router = express.Router();

const visitorModel = mongoose.model("VisitorSchema");
const roleModel = mongoose.model("RoleSchema");

var getRoleNameFromDbValue;

module.exports.controller = function(app) {
  
    //api to create new user
    router.post("/api/v1/visitorSignup", function(req, res) {
      
       const token = Buffer.from(`${req.body.visitor_name}:${req.body.visitor_email}`, 'utf8').toString('base64');
       const today = Date.now();
       const id = shortid.generate();

       Promise.resolve(getRoleNameFromDb);
  
        //create user.
       const newVisitor = new visitorModel({
          visitor_id: id,
          visitor_name: req.body.visitor_name.replace(/\s/g, ''),
          visitor_email: req.body.visitor_email,
          phone_number: req.body.phone_number,
          company_name: req.body.company_name,
          number_of_employees: req.body.number_of_employees,
          role: getRoleNameFromDbValue,
          createdOn: today,
          updatedOn: today
       });
  
       newVisitor.save(function(err, result) {
        if (err) {
            res.status(500).send('Some Error Occured During Login.' + err);
          } else if (result == null || result == undefined || result == "") {
            res.status(404).send('User Not Found. Please Check Your Username and Password.');
          } else {
            //req.user = result;
            //req.session.user = result;
            //res.redirect("/chat");
            req.visitor = result;
            delete req.visitor.password;
            req.session.visitor = result;
            delete req.session.visitor.password;
            res.status(200).send({ 
                visitor: req.session.visitor,
                email: req.body.visitor_email, 
                accessToken : token,
                roles : result.role
            });
         }
       });
    });
  
    router.get("/visitorList", function(req, res) {
      visitorModel.find({}, function(err, data) {
          res.status(200).send({ 
            visitorList: data
        });
      });
    });

    var getRoleNameFromDb = (async () => {
        roleModel.findOne({ $and: [{ role_name : "ROLE_VISITOR"}] }, function(err, data){
          if(err){
            return err;
          }
          getRoleNameFromDbValue = data.role_name;
          return data;
        });
      })();

    app.use("/visitor", router);
  };
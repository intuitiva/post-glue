'use strict';

//Call Libraries
//const AWS = require('aws-sdk');
const axios = require('axios')

//Define AWS resources objects
//var s3 = new AWS.S3();

//Lambda handler for the S3 File Processing
module.exports.cloudwatchglues3cleaner = (event, context, callback) => {

  let myProm = new Promise(async function(resolve, reject){

    console.log("Event ==> " + JSON.stringify(event))

    //Set the Headers for all Zauru REST API Requests
    var headersdata = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': process.env.ZAURU_HEADER_USER_EMAIL,
      'X-User-Token': process.env.ZAURU_HEADER_USER_TOKEN
    };

    // Get glue job event information
    if (event.hasOwnProperty('detail')) {
      var glue_job_id = event.detail.jobRunId;
      var glue_job_state = event.detail.state;
      var glue_job_message = event.detail.message;

      if (glue_job_state == 'SUCCEEDED') {
        var is_error = false;
      } else {
        var is_error = true;
      }

      var get_options = {
        headers: headersdata,
        url: process.env.ZAURU_GET_UUID_URL_PREFIX + glue_job_id + process.env.ZAURU_GET_UUID_URL_SUFIX,
        method: 'GET'
      }

      axios(get_options).then(function (response) {

        console.log("GET Zauru API success! " + response.data);
        var id = response.data;

        // Configure call PUT Zauru API
        var put_data = {
          "data_import_job": 
            {
              "ready_to_fetch_to_local_db": !is_error,
              "source": "Post-Glue lambda", 
              "status": "PASO 3 de 9) JOB Glue " + glue_job_state + " > " + glue_job_message, 
              "percentage_completed": "60",
              "is_error": is_error
            }
        };

        var put_options = {
          data: put_data,
          headers: headersdata,
          url: process.env.ZAURU_PUT_URL + id + ".json",
          method: "PUT"
        };
  
        // Really call PUT Zauru API
        axios(put_options).then(function (response) {
  
          console.log("PUT Zuru API success!")
          callback(null, "Successfully PUT!")
        }) // in case the PUT didnt work
          .catch(function (error) { // If error
            console.log(error);
            callback(null, "Error: PUT didnt work")
          });

      }) // in case the GET didnt work
        .catch(function (error) { // if error on GET
          console.log(error);
          callback(null, "Error: GET didnt work")
        });

    } // in case the event param doesnt have "detail"
    else {
      callback(null, "Event doesnt have detail")
    }

  });
};


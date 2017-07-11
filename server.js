'use strict'

const auth = require('./auth')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const CronJob = require('cron').CronJob

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'jade')
app.use(express.static('views')) 

//FOR HEROKU
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

//CONSTS
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID   || auth.accountSid
const TWILIO_KEY = process.env.TWILIO_API_KEY   || auth.authToken
const TWILIO_PHONE_NUMBER = process.env.TWILIO_NUMBER || auth.twilioNumber
const MY_NUMBER = process.env.MY_NUMBER || auth.myNumber


// CLIENTS
var twilio = require('twilio')(TWILIO_SID, TWILIO_KEY);

//ROUTES
app.get('/', (req, res, next)=>{
  res.render('index', {
    title: 'Welcome'
  })
})

// app.post('/catfacts', (req, res, next)=>{
//   var number = req.body.From
//   if(number != MY_NUMBER){
//     console.log('SOMETHING WENT WRONG: NO FROM VALUE')
//     respondToText(res, "Sorry, Something went wrong. Please try again in a moment")
//   } else {
//     let incomingMessage = req.body.Body
//     let {targetNumber, intervalInMinutes} = parseMessage(incomingMessage)
//     debugger;
//   }
// })


app.listen(port)
console.log('Listening on port: ' + port )

/* 
   HELPERS
~~~~~~~~~~~~~~~~~~~~~~~~*/

function parseMessage(msg){
  let optsArray = msg.split(' ')
  return {
    targetNumber: optsArray[0],
    intervalInMinutes: optsArray[1]
  }
}

function startCron(interval, numTimes, cb){
  var index = 0
  var job = new CronJob(`* * * * * *`, function(){
    cb()
    index += 1
    if(index == numTimes){
      job.stop()
    }
  }, true, -6)
}


function respondToText(res, msg){
  res.type('text/xml')
  res.render('message', {
      message: msg
  });
}

function sendText(number, msg){
  let opts = {
    to: number,
    from: TWILIO_PHONE_NUMBER,
    body: msg
  }

  twilio.messages.create(opts, (err, response)=>{
    if(err) console.log(err)
    else {
      console.log('message sent')
    }
  })
}


/*
    _  _   _ _____ ___  ___ _   ___   __
   /_\| | | |_   _/ _ \| _ ) | | \ \ / /
  / _ \ |_| | | || (_) | _ \ |_| |\ V / 
 /_/ \_\___/  |_| \___/|___/\___/  |_|  
                                        
*/


// search for a number 

// twilio.availablePhoneNumbers("US").local.list({
//   contains: '******7627',
//   MmsEnabled: true
// },(err, data)=>{
//   let number = data.availablePhoneNumbers[0]
//   console.log(number)
//   // purchases the number

//   // twilio.incomingPhoneNumbers.create({
//   //   phoneNumber: number.phone_number
//   // }, (err, purchaseNumber)=>{
//   //   console.log(purchaseNumber.sid)
//   // })
// })
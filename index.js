const fs = require('fs');
const express = require('express');

let app = require('express')();
let http = require('http').Server(app);
let bodyParser = require('body-parser');

let io = require('socket.io')(http);
let port = process.env.PORT || 3000;
let nodemailer = require('nodemailer');

const key = process.env.KEY;
const encryptor = require('simple-encryptor')(key);

const {
	type,
	project_id,
	private_key_id,
	private_key,
	client_email,
	client_id,
	auth_uri,
	token_uri,
	auth_provider_x509_cert_url,
	client_x509_cert_url
} = process.env;

const serviceAccount = {
	type,
	project_id,
	private_key_id,
	private_key,
	client_email,
	client_id,
	auth_uri,
	token_uri,
	auth_provider_x509_cert_url,
	client_x509_cert_url
};

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreplyimpala@gmail.com',
    pass: process.env.EMAILPWD
  }
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('', function (req, res) {
  const index = __dirname + '/public/static/index.html';

  res.sendFile(index);
});

app.post('', function (req, res) {

});

app.post('/create-account', async function (req, res) {
  const account_name = req.body.name;
  const account_email = req.body.email;
  const account_pwd = req.body.pwd;

  console.log("ACCOUNT CREATION REQUEST");

  const accountRef = db.collection('shoppeplazaaccounts').doc('accountlog');
  const doc = await accountRef.get();

  const accountArray = doc.data().log.split("*(=/]|;");

  const accountLog = doc.data().log;

  async function getAccountCred () {
    var i;

    if (accountLog.includes(account_name)) {
      console.log("Found match for " + account_name);
      console.log("ERROR: ACCOUNT EXISTS");

      res.send("exists");
    }

    else {
      await accountRef.set({
        log : doc.data().log + account_name + "/*email" + account_email + "/*pwd" + encryptor.encrypt(account_pwd) + "*(=/]|;"
      });

      let mailOptions = {
        from : 'noreplyimpala@gmail.com',
        to : account_email,
        subject : 'Welcome to the Shoppe Plaza!',
        html : '<img src="https://media.discordapp.net/attachments/772064957793435678/781655590136578068/unknown.png" style="border-radius: 8px;"/>'  
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } 

        else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
  }

  getAccountCred();
});

app.post('/login', async function (req, res) {
  const name = req.body.name;
  const pwd = req.body.pwd;

  console.log("LOGIN REQUEST");

  const accountRef = db.collection('shoppeplazaaccounts').doc('accountlog');
  const doc = await accountRef.get();

  const accountlog = doc.data().log;
  const accountArray = accountlog.split("*(=/]|;");

  function getAccountCred () {
    if (accountArray.includes(name)) {

    }

    else {
      console.log("No match found for " + name);
      
      res.send("");
    }
  }

  getAccountCred();
});

app.post('/forgot-password', function (req, res) {
  const junk = req.body.junk;

  let mailOptions = {

  }
});

http.listen(port, function(){
  console.log('listening on *:' + port);

  const accountRef = db.collection('shoppeplazaaccounts').doc('accountlog');

  async function fixPlaza () {
    const doc = await accountRef.get();

    if (!doc.exists) {
      const fix_data = {
        log : ""
      }

      await accountRef.set(fix_data);
    }

    else {
      console.log("No fix needed.");

      const accountlog = doc.data().log;

      const accountArray = accountlog.split("*(=/]|;");
      console.log(accountArray);
    }
  }

  fixPlaza();
});
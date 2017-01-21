var express = require('express');
var app = express();
var passport = require('passport');
var mysql = require('mysql');
var flash = require('connect-flash');
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var DropboxStrategy = require('passport-dropbox-oauth2').Strategy;
var tok,user1,userpassword;

passport.use(new DropboxStrategy({
    apiVersion: '2',
    clientID: '7ck5saosgyq9r2i',
    clientSecret: 'delz1p2prh4cv98',
    callbackURL: "http://127.0.0.1:8080/auth/dropbox-oauth2/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	process.nextTick(function(){
  		tok = accessToken;
      user1 = 'john';
      userpassword = 'johnson';
      var string = "INSERT INTO users(username,password,accessToken)VALUES"+"('"+ user1 + "','" + userpassword + "','"+ tok+"')";
      console.log(string);
      connection.connect();
      var success = connection.query(string);
      console.log(success);
      console.log('this is ur token ' + accessToken);
      return done(null);
  });}
));
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'MotionDetect'
});
app.use(morgan('dev'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(require('express-session')({secret: 'anystrinhoftext',
				 saveUnititialized: true,
				 resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/',function(req,res)
	{
	 res.render('index.html');
	 console.log(tok);
	});
app.get('/auth/dropbox',
  passport.authenticate('dropbox-oauth2'));

app.get('/auth/dropbox-oauth2/callback', 
  passport.authenticate('dropbox-oauth2', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.listen(port);
console.log("server running on" + port);
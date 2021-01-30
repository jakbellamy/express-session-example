const express = require('express');
const app = express();
const session = require('express-session');

// app middleware to parse body and requests
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// add middleware to initialize session
app.use(session({
  secret: 'tacocat',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000 * 60}
}));

// app middleware to guard application access without login.
app.use(function (request, response, next) {
  if (request.session.user) {
    next();
  } else if (request.path == '/') {
    next();
  } else {
    response.redirect('/');
  }
});

app.use(express.static(__dirname + '/public'));

app.post('/', function (request, response) {
  var username = request.body.username;
  var password = request.body.password;

  if (username == 'aaron' && password == 'narf') {
    console.log(request.session.user);
    request.session.user = username;
    console.log(request.session.user);
    response.redirect('/admin');
  } else {
    response.redirect('/');
  }
});

// app logout to destroy session stored at the backend
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/')
})

app.listen(3000, () => {
  console.log("My API is now listening on port 3000...");
})

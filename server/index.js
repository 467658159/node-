/**
 * Created by Administrator on 2017/8/3.
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(session({
  name:config.session.key,
  secret:config.session.secret,
  resave:true,
  saveUninitialized:false,
  cookie:{
    maxAge:config.session.maxAge
  },
  store:new MongoStore({
    url:config.mongodb
  })
}));

routes(app);

app.get('*', function(req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
  res.send(html)
});

app.listen(config.port,()=>{
  console.log(`Fullstack blog is running at ${config.port}`);
});

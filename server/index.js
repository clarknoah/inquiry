const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3005;
const publicPath = path.join(__dirname, '..', 'build');
const neodashPath = path.join(__dirname, '..', 'dist');
app.use("/app", express.static(publicPath));

app.use("/dashboard", express.static(neodashPath));

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(neodashPath, 'index.html'));
 });

 app.get('/app', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
 });

app.get('/*', (req, res) => {
    res.redirect("/app");
 });

app.listen(port, () => {
   console.log(`Server is up on port ${port}!`);
});
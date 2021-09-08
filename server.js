require('dotenv').config()

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json())

const posts = [
    {
        username:'kile',
        title:'post 1'
    },

    {
        username:'Jim',
        title:'post 2'
    }
]


app.get('/posts', authenticationToken,  (req, res) => {

     res.json(posts.filter(post => post.username === req.user.name))

});

app.post('/login', (req,res) => {

    const username = req.body.username;
    const user = { name: username};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.json({accessToken: accessToken})

})

function authenticationToken(req, res, next){

    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1];
    console.log('El TOKEN ES',token)

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        console.log('el req user es...', req.user)
        next()
    })
}

app.listen(3000);
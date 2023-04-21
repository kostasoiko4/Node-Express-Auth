const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const { request, response } = require('express')

app.use(express.json())

const users = []

app.get('/users', (request, response) => {
    response.json(users)
})

//Create User
app.post('/users', async (request, response) => {
    try{
        //Create salt and hash password, 10 the number of rounds
        const hashedPassword = await bcrypt.hash(request.body.password, 10)
        
        const user = {name: request.body.name, password: hashedPassword}

        users.push(user)
        response.sendStatus(201)
    } catch {
        response.sendStatus(500)
    }
})

//Login to account
app.post('/users/login', async (request, response) => {
    const user = users.find(user => user.name = request.body.name)

    if (user == null) return response.status(400).send('Cannot find user')

    try{
        if (await bcrypt.compare(request.body.password, user.password)) {
            response.send('Succes')
        } else {
            response.send('Not Allowed')
        }
    } catch {
        response.sendStatus(500)
    }
})

app.listen(3000)
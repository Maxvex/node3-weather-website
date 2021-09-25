const path = require('path')
const express = require('express')
const hbs =require('hbs')
const forecast = require('./utils/forecast')
const geocode  = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res) => {
    res.render('index',{
        title: 'Weather',
        name: 'Maxime Simeon'
    })
})

app.get('/weather',(req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, {longitude,latitude, location} ={}) => {
        if(error){
            //return console.log(error)
            return res.send({error})
        }

        forecast(longitude, latitude, (error, forecastData) => {
            if(error){
                //return console.log(error)
                return res.send({error})
            } 
            // console.log(location)
            // console.log(forecastData) 
            res.send({
                location,
                forecast : forecastData,
                address : req.query.address
            })

        })
    })
    
    
})


app.get('/about',(req,res) => {
    res.render('about', {
        title:'About Me',
        name: 'Maxime Simeon'
    })

})



app.get('/help',(req,res) => {
    res.render('help', {
        title:'Help',
        message: 'How can we help you',
        name: 'Maxime Simeon'
    })

})
app.get('/help/f*',(req,res) => {
    //res.send('Help article not found')
    res.render('p404', {
        title:'404',
        message: 'Help article not found',
        name: 'Maxime Simeon'
    })
 })

app.get('*',(req,res) => {
   //res.send('My 404 page')
   res.render('p404', {
    title:'404',
    message: 'Page not found',
    name: 'Maxime Simeon'
})
})

app.listen(port, ()  => {
    console.log('Server is up on port ' + port)
})
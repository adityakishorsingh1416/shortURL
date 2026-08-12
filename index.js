import express from 'express'
import urlRoutes from './routes/url.js'
import connectDB from './config/db.js'
import URL from './models/url.js'
import dotenv from 'dotenv'


const PORT = process.env.PORT
const app = express()
const PORT = 8001
dotenv.config()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

// Database connection
connectDB('process.env.MONGODB_URI')
    .then(() => console.log("Database is connected 🚀"))
    .catch((err) => console.log(err))

// Routes
app.use('/url', urlRoutes)

// Home route
app.get('/', (req, res) => {
    res.render('index')
})

// Redirect route
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId

    const url = await URL.findOneAndUpdate(
        { shortId: shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        },
        { returnDocument: 'after' }
    )

    if (!url) {
        return res.status(404).send("URL not found") 
    }

    res.redirect(url.redirectUrl)
})

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
import { nanoid } from 'nanoid'
import URL from '../models/url.js'

async function handleGenerateNewShortURL(req, res) {
    const body = req.body

    if (!body.url) {
        return res.status(400).send("Url is required")
    }

    try {
        const shortID = nanoid(6)

        await URL.create({
            shortId: shortID,
            redirectUrl: body.url,
            visitHistory: []
        })

        return res.status(200).send(shortID)

    } catch (error) {

        // Duplicate URL
        if (error.code === 11000) {
            return res.status(409).send("This URL already exists!")
        }

        console.log(error)
        return res.status(500).send("Something went wrong!")
    }
}

export default handleGenerateNewShortURL
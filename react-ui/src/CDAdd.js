import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { CDServiceProxy as CDService } from ".//models/cd-proxy.mjs"
import { CD } from "./models/cd.mjs"

function CDAdd({ setChanged }) {
    const [ formData, setFormData ] = useState({})
    const navigate = useNavigate()

    const handleChange = (event) => {
        const { id, value } = event.target
        const name = id.replace("cd-", "")
        setFormData(prevData => ({...prevData, [name]: value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const uri = `http://localhost:3000/api/cds`;
        const cdService = new CDService(uri)
        const cd = new CD(undefined, formData.artist, formData.title, formData.tracks, formData.price)
        console.log(cd)
        const id = await cdService.create(cd)
        setChanged(true)
        navigate("/cds")
    }

    return (
        <>
            <h1>Add: </h1>
            <form id="cd-detail-form" onSubmit={handleSubmit}>
                <br/>
                <label htmlFor="cd-artist">Artist</label>
                <input type="text" id="cd-artist" value={formData.artist || ""} onChange={handleChange} /><br/>

                <label htmlFor="cd-title">Title</label>
                <input type="text" id="cd-title" value={formData.title || ""} onChange={handleChange} /><br/>

                <label htmlFor="cd-tracks">Tracks</label>
                <input type="text" id="cd-tracks" value={formData.tracks || ""} onChange={handleChange} /><br/>

                <label htmlFor="cd-price">Price</label>
                <input type="text" id="cd-price" value={formData.price || ""} onChange={handleChange} /><br/>

                <button>Add</button>
            </form>
        </>
    )
}

export default CDAdd
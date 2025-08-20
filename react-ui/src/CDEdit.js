import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { CDServiceProxy as CDService } from ".//models/cd-proxy.mjs"

function CDEdit({ setChanged }) {
    const { cd_id } = useParams()
    const [ cd, setCD ] = useState(null)
    const navigate = useNavigate()
    
    const handleChange = (event) => {
        const { id, value } = event.target
        const name = id.replace("cd-", "")
        setCD(prevData => ({...prevData, [name]: value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const uri = `http://localhost:3000/api/cds`;
        const cdService = new CDService(uri)
        await cdService.update(cd)
        setChanged(true)
        navigate("/cds")
    }

    useEffect(() => {
        const fetchCD = async (id) => {
            const uri = `http://localhost:3000/api/cds`;
            const cdService = new CDService(uri)
            const cd = await cdService.getByID(id)
            setCD(cd);
        }

        fetchCD(cd_id)
    }, [cd_id])

    if (!cd) return (<p>Loading...</p>)
    
    return (
        <>
            <h1>Update: </h1>
            <form id="cd-detail-form" onSubmit={handleSubmit}>
                <input type="hidden" id="cd-id" value={cd.id} /><br/>

                <label htmlFor="cd-artist">Artist</label>
                <input type="text" id="cd-artist" value={cd.artist} onChange={handleChange} /><br/>

                <label htmlFor="cd-title">Title</label>
                <input type="text" id="cd-title" value={cd.title} onChange={handleChange} /><br/>

                <label htmlFor="cd-tracks">Tracks</label>
                <input type="text" id="cd-tracks" value={cd.tracks} onChange={handleChange} /><br/>

                <label htmlFor="cd-price">Price</label>
                <input type="text" id="cd-price" value={cd.price} onChange={handleChange} /><br/>

                <button>Update</button>
            </form>
        </>
    )
}

export default CDEdit
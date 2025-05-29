import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { CDServiceProxy as CDService } from ".//models/cd-proxy.mjs"

function CDEdit() {

    const { cd_id } = useParams()
    const [ cd, setCD ] = useState(null)

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
            <form id="cd-detail-form">
                <input type="hidden" id="cd-id" value={cd.id} />

                <label htmlFor="cd-artist">Artist</label>
                <input type="text" id="cd-artist" value={cd.artist} />

                <label htmlFor="cd-title">Title</label>
                <input type="text" id="cd-title" value={cd.title} />

                <label htmlFor="cd-tracks">Tracks</label>
                <input type="text" id="cd-tracks" value={cd.tracks}  />

                <label htmlFor="cd-price">Price</label>
                <input type="text" id="cd-price" value={cd.price} />

                <button>Update</button>
            </form>
        </>
    )
}

export default CDEdit
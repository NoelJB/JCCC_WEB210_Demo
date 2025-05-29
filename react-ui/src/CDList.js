import { Fragment } from "react"
import { Link, useNavigate, Outlet } from "react-router-dom"

import { CDServiceProxy as CDService } from "./models/cd-proxy.mjs"

function CDList({ compactDiscs, setChanged }) {
    const navigateTo = useNavigate()

    const deleteCD = async (id) => {
        const uri = `http://localhost:3000/api/cds`;
        const cdService = new CDService(uri)
        await cdService.delete(id);

        setChanged(true)
    }

    const availableCDs = () => {
        return (
            <section id="cd-list">
                <h1>Available CDs</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Artist</th>
                            <th>Title</th>
                            <th>Delete</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody id="cd-items">
                        {
                            compactDiscs.map(cd => {
                                const path = `/cds/${cd.id}`
                                return (
                                    <Fragment key={cd.title}>
                                        <tr>
                                            <td>{cd.artist}</td>
                                            <td><Link to={path}>{cd.title}</Link></td>
                                            <td><button onClick={() => deleteCD(cd.id)}>&#128465;</button></td>
                                            <td><button onClick={() => navigateTo(`/cds/edit/${cd.id}`)}>&#x270e;</button></td>
                                        </tr>
                                    </Fragment>
                                )
                            })
                        }
                    </tbody>
                </table>
            </section>
        )
    }

    return (
        <>
        <div style={{ display: 'flex' }}> {/* Column layout using flexbox */}
            <div style={{ marginRight: 25 }}>
                { availableCDs() }
            </div>
            <div style={{ flex: 1 }}>
                <Outlet /> {/* Child routes will render here */}
            </div>
        </div>
        </>
    )
}

export default CDList
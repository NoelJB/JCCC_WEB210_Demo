import { useEffect, useState } from "react"
import { Routes, Route } from 'react-router-dom'


import { CDServiceProxy as CDService } from ".//models/cd-proxy.mjs"

import CDList from "./CDList.js"
import CDDetails from "./CDDetails.js"
import CDEdit from "./CDEdit.js"
import CDAdd from "./CDAdd.js"

function CDView() {
	const [compactdiscsData, setCompactdiscsData] = useState([])
	const [changed, setChanged] = useState(true)

	const fetchCDs = async () => {
		const uri = `http://localhost:3000/api/cds`;
		const cdService = new CDService(uri)
		const cds = await cdService.getAll();

		setCompactdiscsData(cds)
		setChanged(false)
	}

	useEffect(() => {
		if (changed) fetchCDs()
	}, [changed])

	return (
		<>
			<Routes>
				<Route path="/" element={<CDList compactDiscs={compactdiscsData} setChanged={setChanged} />}>
					<Route path=":cd_id" element={<CDDetails />} />
					<Route path="/edit/:cd_id" element={<CDEdit setChanged={setChanged} />} />
					<Route path="/add" element={<CDAdd setChanged={setChanged} />} />
				</Route>
			</Routes>
		</>
	)
}

export default CDView

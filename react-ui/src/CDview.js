import { useEffect, useState } from "react"
import { Routes, Route } from 'react-router-dom'


import { CDServiceProxy as CDService } from ".//models/cd-proxy.mjs"

import CDList from "./CDList.js"
import CDDetails from "./CDDetails.js"

function CDView() {
	const [compactdiscsData, setCompactdiscsData] = useState([])

	const fetchCDs = async () => {
		const uri = `http://localhost:3000/api/cds`;
		const cdService = new CDService(uri)
		const cds = await cdService.getAll();

		setCompactdiscsData(cds)
	}

	useEffect(() => {
		fetchCDs()
	}, [])

	return (
		<>
			<Routes>
				<Route path="/" element={<CDList compactDiscs={compactdiscsData} />}>
					<Route path=":cd_id" element={<CDDetails />} />
				</Route>
			</Routes>
		</>
	)
}

export default CDView

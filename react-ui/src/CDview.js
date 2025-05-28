import { useEffect, useState } from "react"

import { CDServiceProxy as CDService } from ".//models/cd-proxy.mjs"

import CDList from "./CDList.js"

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
			<CDList compactDiscs={compactdiscsData}/>
		</>
	)
}

export default CDView

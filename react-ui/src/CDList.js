import { Fragment } from "react"

function CDList({compactDiscs}) {
    return (
        <>
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
								return (
									<Fragment key={cd.title}>
										<tr>
											<td>{cd.artist}</td>
											<td>{cd.title}</td>
											<td><button delete data-cd_id="{cd.id}">&#128465;</button></td>
											<td><button edit data-cd_id="{cd.id}">&#x270e;</button></td>
										</tr>
									</Fragment>
								)
							})
						}
					</tbody>
				</table>
			</section>
        </>
    )
}

export default CDList
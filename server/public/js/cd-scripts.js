function disableControl(elements, disabled) {
    elements.forEach(element => element.disabled = disabled)
}

function registerClickHandler(elements, handler) {
    elements.forEach(element => element.addEventListener("click", function(event) {
        event.preventDefault()  // IMPORTANT: cancels default browser behaviors
        handler(event.target.dataset.cd_id)
    }))
}

async function updateCD() {
    let cd = new CD(document.getElementById("cd-id").value,
                    document.getElementById("cd-title").value,
                    document.getElementById("cd-artist").value,
                    document.getElementById("cd-tracks").value,
                    document.getElementById("cd-price").value)

    console.log(`Update ${cd}`)
    await cdService.update(cd)
    populateCDTable()
}

async function editCD(id) {
    await populateCDDetails(id);

    // For a potential future change where we don't brute force disable all deletes and edits while editing
    // if (!document.getElementById("update-button")) {}

    const form = document.getElementById("cd-detail-form")

    disableControl(Array.from(form.querySelectorAll("input[type='text']")), false)
    disableControl(Array.from(document.querySelectorAll("button[delete]")), true)
    disableControl(Array.from(document.querySelectorAll("button[edit]")), true)

    disableCDLinks = true;

    const updateButton = document.createElement("button")
    updateButton.setAttribute("id", "update-button")
    updateButton.innerHTML = "Update"
    registerClickHandler([updateButton], event => {
        form.removeChild(updateButton)

        disableControl(Array.from(form.querySelectorAll("input[type='text']")), true)
        disableControl(Array.from(document.querySelectorAll("button[delete]")), false)
        disableControl(Array.from(document.querySelectorAll("button[edit]")), false)

	disableCDLinks = false;

	updateCD()
    })

    form.appendChild(updateButton)
}

async function deleteCD(id) {
    console.log(`Delete ${id}`)
    await cdService.delete(id)
    populateCDTable()
}

var disableCDLinks = false // this is a quick hack to disable CD selection during edit/add

async function populateCDDetails(id) {
    if (disableCDLinks) return           // if CD links are disabled, do not process

    const cd = await cdService.getByID(id)
    document.getElementById("cd-id").value = cd.id
    document.getElementById("cd-artist").value = cd.artist
    document.getElementById("cd-title").value = cd.title
    document.getElementById("cd-tracks").value = cd.tracks
    document.getElementById("cd-price").value = cd.price
}

async function populateCDTable() {
    let content = ""
    const cds = await cdService.getAll()
    cds.forEach(cd => content += 
		`<tr>
                     <td>${cd.artist}</td>
                     <td><a href data-cd_id="${cd.id}">${cd.title}</a></td>
                     <td><button delete data-cd_id="${cd.id}">&#128465;</button></td>
                     <td><button edit data-cd_id="${cd.id}">&#x270e;</button></td>
                  </tr>`
	       )

    const cd_element = document.getElementById("cd-items")
    cd_element.innerHTML = content

    const links = Array.from(cd_element.getElementsByTagName("a"))
    registerClickHandler(links, populateCDDetails)

    let buttons = Array.from(cd_element.querySelectorAll("button[delete]"))
    registerClickHandler(buttons, deleteCD)

    buttons = Array.from(cd_element.querySelectorAll("button[edit]"))
    registerClickHandler(buttons, editCD)
}

var currentPage = undefined
function changePage(id) {
    if (currentPage) {
	document.getElementById(currentPage).style.display = "none"
    }
    document.getElementById(id).style.display = "block"
    currentPage = id
}


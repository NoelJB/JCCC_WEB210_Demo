function disableControl(elements, disabled) {
    elements.forEach(element => element.disabled = disabled)
}

function registerClickHandler(elements, handler) {
    elements.forEach(element => element.addEventListener("click", function(event) {
        event.preventDefault()  // IMPORTANT: cancels default browser behaviors
        handler(event.target.dataset.item_id)
    }))
}

async function createCD() {
    const form = document.getElementById("cd-add-form")
    let cd = new CD(undefined,
                    form.querySelector("#cd-title").value,
                    form.querySelector("#cd-artist").value,
                    form.querySelector("#cd-tracks").value,
                    form.querySelector("#cd-price").value)

    console.log(`Create ${cd}`)
    const id = await cdService.create(cd)
    form.querySelector("#status").innerHTML = `<p>Added CD #${id}</p>`
}

async function prepareAdd() {
    const page = document.getElementById("add_page")
    const button = page.querySelector("#create-button")
    registerClickHandler([button], createCD)
}

async function updateCD() {
    const form = document.getElementById("cd-detail-form")
    let cd = new CD(form.querySelector("#cd-id").value,
                    form.querySelector("#cd-title").value,
                    form.querySelector("#cd-artist").value,
                    form.querySelector("#cd-tracks").value,
                    form.querySelector("#cd-price").value)

    console.log(`Update ${cd}`)
    await cdService.update(cd)
    populateCDTable()
}

async function editCD(id) {
    await populateCDDetails(id);

    const form = document.getElementById("cd-detail-form")
    const cd_list = document.getElementById("cd-list")

    disableControl(Array.from(form.querySelectorAll("input[type='text']")), false)
    disableControl(Array.from(cd_list.querySelectorAll("button[delete]")), true)
    disableControl(Array.from(cd_list.querySelectorAll("button[edit]")), true)

    disableCDLinks = true;

    const updateButton = document.createElement("button")
    updateButton.setAttribute("id", "update-button")
    updateButton.innerHTML = "Update"
    registerClickHandler([updateButton], event => {
        form.removeChild(updateButton)

        disableControl(Array.from(form.querySelectorAll("input[type='text']")), true)
        disableControl(Array.from(cd_list.querySelectorAll("button[delete]")), false)
        disableControl(Array.from(cd_list.querySelectorAll("button[edit]")), false)

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

    const form = document.getElementById("cd-detail-form")
    form.querySelector("#cd-id").value = cd.id
    form.querySelector("#cd-artist").value = cd.artist
    form.querySelector("#cd-title").value = cd.title
    form.querySelector("#cd-tracks").value = cd.tracks
    form.querySelector("#cd-price").value = cd.price
}

async function populateCDTable() {
    let content = ""
    const cds = await cdService.getAll()
    cds.forEach(cd => content += 
		`<tr>
                     <td>${cd.artist}</td>
                     <td><a href data-item_id="${cd.id}">${cd.title}</a></td>
                     <td><button delete data-item_id="${cd.id}">&#128465;</button></td>
                     <td><button edit data-item_id="${cd.id}">&#x270e;</button></td>
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
    if (currentPage === id) return;
 
    if (currentPage) {
	document.getElementById(currentPage).style.display = "none"
    }
    document.getElementById(id).style.display = "block"
    currentPage = id
    document.getElementById(id).setup?.()   // ECMAScript 2021 -- call setup only if it exists
}


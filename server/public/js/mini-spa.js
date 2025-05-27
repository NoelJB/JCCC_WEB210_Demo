function disableControl(elements, disabled) {
    elements.forEach(element => element.disabled = disabled)
}

function registerClickHandler(elements, handler) {
    elements.forEach(element => element.addEventListener("click", function(event) {
        event.preventDefault()  // IMPORTANT: cancels default browser behaviors
        handler(event.target.dataset.item_id)
    }))
}

var currentPage = undefined
function changePage(id) {
    if (currentPage === id) return;
 
    if (currentPage) {
	document.getElementById(currentPage).style.display = "none"
    }
    document.getElementById(id).style.display = "block"
    currentPage = id
    eval(document.getElementById(id).dataset.setup)?.()   // ECMAScript 2021 -- call setup only if it exists
}

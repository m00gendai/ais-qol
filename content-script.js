function buttonize(header){
	
	const btn = document.createElement("button")
	btn.id ="extensionPrintButton"
	btn.textContent = "Better Printable View"
	btn.style.position = "absolute"
	btn.style.top = "1rem"
	btn.style.left = "50%"
	btn.style.margin= "1 0 0 0"
	btn.style.padding = "0.5rem"
	btn.style.borderRadius = "5px"
	btn.style.transform = "translateX(50%)"
	btn.style.background = "white"
	btn.style.color ="blue"
	btn.style.border = "1px solid blue"
	header.appendChild(btn)

	btn.addEventListener("click", function(){
		const selectedLi = document.querySelector('a[aria-selected="true"]'); // Get the selected <li>
		const control = selectedLi.getAttribute("aria-controls")
		const section = document.getElementById(control)
		const data = section.querySelector("emailui-rich-text-output"); // Get data from WITHIN the selected <li>

		const caseNumber = selectedLi.getAttribute("title").split(" | ")[0]
		let html = `<!DOCTYPE html>
<html><head>
		<title>${caseNumber}</title>
		<style>
.bodyContainer {
width: 210mm;
  max-width: 210mm;
  box-sizing: border-box;
  margin: 0;
}

.bodyContainer img {
  max-width: 100% !important;
    height: auto !important;
    box-sizing: inherit !important;
}</style>
		 </head><body>`
		html += `<div class="bodyContainer">`
		html += `<h1 style="color: red;">Case ${caseNumber}</h1>`
		
		const addnData = section.querySelector("records-record-layout-block")
		const addnDataLabels = addnData.querySelectorAll("dt")
		const addnDataContent = addnData.querySelectorAll("dd")

html += `<div style="width: 100%; display: flex; flex-wrap: wrap; font-size: 11px; padding: 0 0 5px 0; border-bottom: 1px solid black; margin: 0 0 1rem 0;">`;

for (let i = 0; i < addnDataLabels.length; i++) {
html += `<div style="width: 50%; display: flex; padding: 0 0 0.25rem 0;">
		<div style="font-weight: bold; width: 50%;">
			${addnDataLabels[i].textContent}:
		</div>
		<div style="width: 50%;">
			${addnDataContent[i].textContent.split(`Edit ${addnDataLabels[i].textContent}`)[0]}
		</div>
	</div>`;
}

html += `</div>`;
html += data.getAttribute("value");
html += `</div></body></html>`; // Correctly close body and html
	const newWindow = window.open(); // Open a new blank window/tab
newWindow.document.open(); // Open the document stream
newWindow.document.write(html); // Write the HTML string
newWindow.document.close(); // Close the document stream
})
}

// Init function
(async () => {
	
	// Checks the toggle state and either starts or ends the Mutation Observer
	const result = await chrome.storage.local.get(["status_declutterer"])
	if(result.status_declutterer === undefined || result.status_declutterer[0] === "0"){
		return
	}
	if(result.status_declutterer[0] === "1"){
		
		// If its ON, it also calls the injection function
console.log("localstorage ON")

const observer = new MutationObserver(mutations => {
	for (const mutation of mutations) {
		for (const addedNode of mutation.addedNodes) {
			if (addedNode.nodeType === 1 && addedNode.matches("emailui-rich-text-output")) {
				buttonize(addedNode);
				return; // Exit to avoid multiple calls.
			} else if (addedNode.nodeType === 1) {
				const header = addedNode.querySelector("emailui-rich-text-output");
				if (header) {
					buttonize(header);
					return; // Exit to avoid multiple calls.
				}
			}
		}
	}
});

observer.observe(document.body, { childList: true, subtree: true }); // Observe changes to the <body> and its descendants

//If the element is already there, you can still buttonize it.
const header = document.querySelector("emailui-rich-text-output");
if (header) {
	buttonize(header);
	observer.disconnect(); // Stop observing once you've found the element (optional)
}
}
})()

// Listens for messages from the toggle state and Percentage Input Field Amends
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
	console.log(request)

		//If the message carries a toggle state and it is ON, call the injection function and start the Mutation Observer
		if(request.toggle_declutterer === "on"){
			console.log("action ON")
			const header = document.querySelector("emailui-rich-text-output");
			if(header){
				buttonize(header)
			}
		} 
		
		//If the message carries a toggle state and it is OFF, disconnet the Mutation Observer and remove the additional injected row if it exists
		if(request.toggle_declutterer === "off"){
			console.log("action OFF")
			const btn = document.getElementById("extensionPrintButton")
			if(btn !== null){
				btn.remove()
		}}

})

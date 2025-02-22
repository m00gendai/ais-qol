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
		const data = section.querySelector("emailui-rich-text-output") ? section.querySelector("emailui-rich-text-output") : section.querySelector(".emailMessageBody.uiOutputText.forceChatterFeedAuxBodyText"); // Get data from WITHIN the selected <li>
		const caseNumber = selectedLi.getAttribute("title").split(" | ")[0]
		
		let html = `<!DOCTYPE html>
						<html>
							<head>
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
									}
								</style>
		 					</head>
							<body>`
		
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
		html += section.querySelector("emailui-rich-text-output") ? data.getAttribute("value") : data.innerHTML
		html += `</div></body></html>`; // Correctly close body and html
	
		const newWindow = window.open(); // Open a new blank window/tab
		newWindow.document.open(); // Open the document stream
		newWindow.document.write(html); // Write the HTML string
		newWindow.document.close(); // Close the document stream
	})

}

//symbol: string
function getCallcenterSymbolOffset(symbol){
	switch(symbol){
		case "pickUp":
			return "211.25px"
		case "forward":
			return "84.5px"
	}
}

// symbol: string, color: string
function callcenter_svg(symbol, color){
	const callcenter = document.querySelector(".slds-utility-panel__body")
	let div = document.getElementById(`callcenter_symbol_color_${symbol}`);

	if (!div) {
		div = document.createElement("div");
		div.id = `callcenter_symbol_color_${symbol}`;
		callcenter.appendChild(div);
		div.style.pointerEvents = "none";
	}

	let svg = div.querySelector("svg"); // Query within the div

	if (!svg) { // Check if SVG exists
		const svgNS = "http://www.w3.org/2000/svg";
		svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute("viewBox", "0 0 1024 1024");
		svg.setAttribute('width', '25px');
		svg.setAttribute('height', '25px');
		const path = document.createElementNS(svgNS, "path");
		path.setAttribute("d", pathData[symbol]); // Make sure pathData_pickUp is defined
		svg.appendChild(path);
		svg.id = `callcenter_symbol_color_${symbol}_svg`
		div.appendChild(svg);

		// Set styles for the div *after* it's added to the DOM
		div.style.position = "absolute";
		div.style.top = "79px";
		div.style.left = getCallcenterSymbolOffset(symbol);
		div.style.width = "42.25px";
		div.style.height = "40px";
		div.style.background = "rgba(51,51,51)";
		div.style.display = "flex";
		div.style.justifyContent = "center";
		div.style.alignItems = "center";
	}

	svg.style.fill = color; // Now safe to set the fill
}

function mutationObserver_SoftphoneQueues(){
	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.type === 'characterData' || mutation.type === 'childList') {
				const queue = document.querySelector(".itemTitle.slds-utility-bar__text");
				if (queue){
					const header  = document.querySelector(".headerLink.panel-header.slds-utility-panel__header.slds-grid.slds-shrink-none")
					if(queue.textContent === "Softphone") {
						queue.parentNode.style.background = "";
						header.style.background = ""
					} 
					if(queue.textContent === "On Queue") {
						queue.parentNode.style.background = "lime";
						header.style.background = "lime"
					} 
					else if (queue.textContent === "Available") {
						queue.parentNode.style.background = "orange";
						header.style.background = "orange"
					} else {
						queue.parentNode.style.background = "red";
						header.style.background = "red"
					}
				}
			}
		}
	});

	const queue = document.querySelector(".itemTitle.slds-utility-bar__text");
	if (queue){
		observer.observe(queue.parentElement, { childList: true, subtree: true, characterData: true, characterDataOldValue: true });
	}
}

// Init function
(async () => {
	// Checks the toggle state and either starts or ends the Mutation Observer
	const result = await chrome.storage.local.get(["status_declutterer"])
	const color_pickUp = await chrome.storage.local.get(["color_pickUp"])
	const color_forward = await chrome.storage.local.get(["color_forward"])
	const softphoneQueues = await chrome.storage.local.get(["status_softphoneQueues"])

	if(result.status_declutterer && result.status_declutterer[0] === "1"){
		// If its ON, it also calls the injection function
		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				for (const addedNode of mutation.addedNodes) {
					if (addedNode.nodeType === 1 && addedNode.matches("emailui-rich-text-output")) {
						buttonize(addedNode);
						return; // Exit to avoid multiple calls.
					}  else if (addedNode.nodeType === 1 && addedNode.matches(".emailMessageBody.uiOutputText.forceChatterFeedAuxBodyText")) {
						buttonize(addedNode);
						return; // Exit to avoid multiple calls.
					}else if (addedNode.nodeType === 1) {
						const header = addedNode.querySelector("emailui-rich-text-output") ? addedNode.querySelector("emailui-rich-text-output") :  addedNode.querySelector(".emailMessageBody.uiOutputText.forceChatterFeedAuxBodyText");
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

/* Commented out for potential future use
	if(color_pickUp.color_pickUp ){
		const color = color_pickUp.color_pickUp[0]
		callcenter_svg("pickUp", color)
	}

	if(color_forward.color_forward ){
		const color = color_forward.color_forward[0]
		callcenter_svg("forward", color)
	}
*/

	if(softphoneQueues.status_softphoneQueues && softphoneQueues.status_softphoneQueues[0] === "1"){
		mutationObserver_SoftphoneQueues()
	}
})()

// Listens for messages from the toggle state and Percentage Input Field Amends
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
	//If the message carries a toggle state and it is ON, call the injection function and start the Mutation Observer
	if(request.toggle_declutterer === "on"){
		const header = document.querySelector("emailui-rich-text-output");
		if(header){
			buttonize(header)
		}
	} 
		
	//If the message carries a toggle state and it is OFF, disconnet the Mutation Observer and remove the additional injected row if it exists
	if(request.toggle_declutterer === "off"){
		const btn = document.getElementById("extensionPrintButton")
		if(btn !== null){
			btn.remove()
	}}


	if(request.phoneColor_pickUp){
		const color = request.phoneColor_pickUp
		callcenter_svg("pickUp", color)
	}
		
	if(request.phoneColor_forward){
		const color = request.phoneColor_forward
		callcenter_svg("forward", color)
	}

	if(request.toggle_softphoneQueues === "on"){
		const queue = document.querySelector(".itemTitle.slds-utility-bar__text");
		if (queue){
			const header  = document.querySelector(".headerLink.panel-header.slds-utility-panel__header.slds-grid.slds-shrink-none")
			if(queue.textContent === "Softphone") {
				queue.parentNode.style.background = "";
				header.style.background = ""
				mutationObserver_SoftphoneQueues()
			} 
			if(queue.textContent === "On Queue") {
				queue.parentNode.style.background = "lime";
				header.style.background = "lime"
				mutationObserver_SoftphoneQueues()
			} 
			else if (queue.textContent === "Available") {
				queue.parentNode.style.background = "orange";
				header.style.background = "orange"
				mutationObserver_SoftphoneQueues()
			} else {
				queue.parentNode.style.background = "red";
				header.style.background = "red"
				mutationObserver_SoftphoneQueues()
			}
		}
	}

	if(request.toggle_softphoneQueues === "off"){
		const queue = document.querySelector(".itemTitle.slds-utility-bar__text");
		if (queue){
			const header  = document.querySelector(".headerLink.panel-header.slds-utility-panel__header.slds-grid.slds-shrink-none")
			queue.parentNode.style.background = "";
			header.style.background = ""
		}
	}
})

//var for hoisting
var pathData = {
	pickUp: "M804.571 708.571q0 15.429-5.714 40.286t-12 39.143q-12 28.571-69.714 60.571-53.714 29.143-106.286 29.143-15.429 0-30.286-2t-32.857-7.143-26.857-8.286-31.714-11.714-28-10.286q-56-20-100-47.429-72.571-45.143-150.857-123.429t-123.429-150.857q-27.429-44-47.429-100-1.714-5.143-10.286-28t-11.714-31.714-8.286-26.857-7.143-32.857-2-30.286q0-52.571 29.143-106.286 32-57.714 60.571-69.714 14.286-6.286 39.143-12t40.286-5.714q8 0 12 1.714 10.286 3.429 30.286 43.429 6.286 10.857 17.143 30.857t20 36.286 17.714 30.571q1.714 2.286 10 14.286t12.286 20.286 4 16.286q0 11.429-16.286 28.571t-35.429 31.429-35.429 30.286-16.286 26.286q0 5.143 2.857 12.857t4.857 11.714 8 13.714 6.571 10.857q43.429 78.286 99.429 134.286t134.286 99.429q1.143 0.571 10.857 6.571t13.714 8 11.714 4.857 12.857 2.857q10.286 0 26.286-16.286t30.286-35.429 31.429-35.429 28.571-16.286q8 0 16.286 4t20.286 12.286 14.286 10q14.286 8.571 30.571 17.714t36.286 20 30.857 17.143q40 20 43.429 30.286 1.714 4 1.714 12z",
	forward: "M841.143 548.571q0 30.857-21.143 52l-372 372q-22.286 21.143-52 21.143-29.143 0-51.429-21.143l-42.857-42.857q-21.714-21.714-21.714-52t21.714-52l167.429-167.429h-402.286q-29.714 0-48.286-21.429t-18.571-51.714v-73.143q0-30.286 18.571-51.714t48.286-21.429h402.286l-167.429-168q-21.714-20.571-21.714-51.429t21.714-51.429l42.857-42.857q21.714-21.714 51.429-21.714 30.286 0 52 21.714l372 372q21.143 20 21.143 51.429z",
}

const color_queue_onQueue = "rgb(13, 202, 240)"
const color_queue_Available = "rgb(25, 135, 84)"
const color_queue_Other = "rgb(220, 53, 69)"

const color_skyblue_100 = "rgba(40, 80, 160, 1)"
const color_skylight_100 = "rgba(160, 190, 230, 1)"
const color_skydarkblue_100 = "rgba(30, 40, 60, 1)"
const color_sunset_100 = "rgba(220, 200, 125, 1)"
const color_aurora_100 = "rgba(70, 145, 155, 1)"
const color_redksy_100 = "rgba(178, 37, 82, 1)"


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
		
		const addnData = section.querySelectorAll("records-record-layout-item")
		const addnDataLabels = [...addnData].map(data => {return data.querySelectorAll(".test-id__field-label")})
		const addnDataContent = [...addnData].map(data => {return data.querySelectorAll(".test-id__field-value")})
		html += `<div style="width: 100%; display: flex; flex-wrap: wrap; font-size: 11px; padding: 0 0 5px 0; border-bottom: 1px solid black; margin: 0 0 1rem 0;">`;

		for (let i = 0; i < addnDataLabels.length; i++) {
			html += `<div style="width: 50%; display: flex; padding: 0 0 0.25rem 0;">
						<div style="font-weight: bold; width: 50%;">
							${addnDataLabels[i][0] && addnDataLabels[i][0].length !== 0 ? `${addnDataLabels[i][0].innerHTML}:` : ""}
						</div>
						<div style="width: 50%;">
							${addnDataContent[i][0] && addnDataContent[i][0].length !== 0 ? addnDataContent[i][0].innerHTML : ""}
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

function dockerizeBar(status){ // status "on" | "off"
	if(document.querySelector(".utilitybar.slds-utility-bar")){
		document.querySelector(".utilitybar.slds-utility-bar").style.justifyContent = status === "on" ? "flex-end" : "flex-start"
	}
}

function dockerizeWindow(status){ // status "on" | "off"
	if(document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel')){
		document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.marginLeft = status === "on" ? "0rem" : "1rem"
		document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.marginRight = status === "on" ? "1rem" : "0rem"
		document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.right = status === "on" ? 0 : ""
	}

}

function mutationObserver_SoftphoneQueues(){
    // Wait until document is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mutationObserver_SoftphoneQueues);
        return;
    }

    // Define target node that contains the softphone queue UI (adjust this as needed)
    const targetNode = document.querySelector("body"); // You may want to narrow this down if possible

    const observer_softphoneQueues = new MutationObserver(mutations => {
        const queue = document.querySelector(".itemTitle.slds-utility-bar__text");
        if (queue) {
            const header = document.querySelector(".headerLink.panel-header.slds-utility-panel__header.slds-grid.slds-shrink-none");
            if (queue.textContent === "Softphone") {
                console.log("Detected SoftphoneQueues None");
                queue.parentNode.style.background = "";
                if (header) header.style.background = "";
            } else if (queue.textContent === "On Queue") {
                console.log("Detected SoftphoneQueues OnQueue");
                queue.parentNode.style.background = color_queue_onQueue;
                if (header) header.style.background = color_queue_onQueue;
            } else if (queue.textContent === "Available") {
                console.log("Detected SoftphoneQueues Available");
                queue.parentNode.style.background = color_queue_Available;
                if (header) header.style.background = color_queue_Available;
            } else {
                console.log("Detected SoftphoneQueues Other");
                queue.parentNode.style.background = color_queue_Other;
                if (header) header.style.background = color_queue_Other;
            }
        }
    });

    // Start observing
    observer_softphoneQueues.observe(targetNode, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

function colorYonderFolders(status){
	const folder = document.querySelectorAll(".yonder-list-item");
	if (folder) {
		const yonderFolders = document.querySelectorAll(".yonder-list-item")
		yonderFolders.forEach(folder =>{
			if(status === "on"){
				if(folder.getAttribute("variant") === "folder"){
					if(folder.classList.contains("current-folder") || folder.getAttribute("index") !== null || folder.classList.contains("opened-folder")){
						folder.style.backgroundColor = color_skyblue_100
						folder.children[1].children[0].style.color = "white" //TEXT
						folder.children[0].children[0].children[0].setAttribute("fill", "white") //ICON FOLDER
						if(folder.getAttribute("index") === null && folder.classList.contains("current-folder")){
							folder.style.marginLeft = "1rem"
							folder.children[1].children[0].style.color = "" //TEXT
							folder.style.backgroundColor = color_skylight_100
							folder.children[0].children[0].children[0].setAttribute("fill", "rgba(0,0,0,0.54") //ICON FOLDER
							
						}
						if(folder.children[2] && folder.children[2].getAttribute("data-testid") === "backToRootFolder"){
							folder.style.backgroundColor = color_skyblue_100
							folder.children[2].children[0].children[0].setAttribute("fill", "white") //ICON BACK TO ROOT
							folder.children[0].children[0].children[0].setAttribute("fill", "white") //ICON FOLDER
							folder.style.marginLeft = ""
							folder.children[1].children[0].style.color = "white" //TEXT
							
						} 
						
					} else {
						folder.style.backgroundColor = color_skylight_100
					}
				} else {
					if(folder.getAttribute("variant") === "folder"){
						folder.style.marginLeft = "1rem"
					}
				}
			} else {
				if(folder.getAttribute("variant") === "folder"){
					if(folder.classList.contains("current-folder") || folder.getAttribute("index") !== null || folder.classList.contains("opened-folder")){
						folder.style.backgroundColor = ""
						folder.children[1].children[0].style.color = "" //TEXT
						folder.children[0].children[0].children[0].setAttribute("fill", "") //ICON FOLDER
						if(folder.getAttribute("index") === null && folder.classList.contains("current-folder")){
							folder.style.marginLeft = ""
							folder.children[1].children[0].style.color = "" //TEXT
							folder.style.backgroundColor = ""
							folder.children[0].children[0].children[0].setAttribute("fill", "") //ICON FOLDER
							
						}
						if(folder.children[2] && folder.children[2].getAttribute("data-testid") === "backToRootFolder"){
							folder.style.backgroundColor = ""
							folder.children[2].children[0].children[0].setAttribute("fill", "") //ICON BACK TO ROOT
							folder.children[0].children[0].children[0].setAttribute("fill", "") //ICON FOLDER
							folder.style.marginLeft = ""
							folder.children[1].children[0].style.color = "" //TEXT
							
						} 
					} else {
						folder.style.backgroundColor = ""
					}
				} else {
					if(folder.getAttribute("variant") === "folder"){
						folder.style.marginLeft = ""
					}
				}
			}
		})
	}
}

let observer_yonderColors = null
function mutationObserver_YonderColors(status){
    // Wait until document is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mutationObserver_YonderColors);
        return;
    }

    // Define target node that contains the softphone queue UI (adjust this as needed)
    const targetNode = document.querySelector(".dashboard-card"); // You may want to narrow this down if possible

	if(status === "on"){
		colorYonderFolders("on")
    	observer_yonderColors = new MutationObserver(mutations => {
        	console.log("YonderColors Mutations checked");
        	colorYonderFolders("on")
    	});
		if(targetNode){
			observer_yonderColors.observe(targetNode, {
				childList: true,
				subtree: true,
				characterData: true
			});
		}
	} else {
		observer_yonderColors.disconnect()
		colorYonderFolders("off")
	}
}

// Init function
(async () => {
	// Checks the toggle state and either starts or ends the Mutation Observer
	const result = await chrome.storage.local.get(["status_declutterer", "status_docker", "status_softphoneQueues", "status_yonderColors"])

	window.addEventListener('hashchange', () => {
  		console.log('Hash changed!', window.location.hash);
  		mutationObserver_YonderColors(result.status_yonderColors === "1" ? "on" : "off")
});

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

	if(result.status_docker && result.status_docker[0] === "1"){
		let dockerBarProcessed = false;
        let dockerWindowProcessed = false;
		const observer_docker = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				for (const addedNode of mutation.addedNodes) {
					if(addedNode.nodeType === 1 && addedNode.matches(".oneUtilityBar.slds-utility-bar_container.oneUtilityBarContent")){
						dockerizeBar("on")
						dockerBarProcessed = true;
					}
					if (addedNode.nodeType === 1 && addedNode.matches(".panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel")) {
						dockerizeWindow("on")
						dockerWindowProcessed = true;
					}  
				}
			}
			if (dockerBarProcessed && dockerWindowProcessed) {
                observer_docker.disconnect();
                console.log("observer_docker disconnected after processing both elements.");
            }
		})

		observer_docker.observe(document.body, { childList: true, subtree: true }); // Observe changes to the <body> and its descendants
	}

	if(result.status_softphoneQueues && result.status_softphoneQueues[0] === "1"){
		mutationObserver_SoftphoneQueues()
	}

	if(result.status_yonderColors && result.status_yonderColors[0] === "1"){
		mutationObserver_YonderColors("on")
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

	if(request.toggle_docker === "on"){
		if(document.querySelector(".utilitybar.slds-utility-bar")){
			document.querySelector(".utilitybar.slds-utility-bar").style.justifyContent = "flex-end"
		}
		if(document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel')){
			document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.marginLeft = "0rem"
			document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.marginRight = "1rem" 
			document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.right =  0
		}
	}
	
	if(request.toggle_docker === "off"){
		if(document.querySelector(".utilitybar.slds-utility-bar")){
			document.querySelector(".utilitybar.slds-utility-bar").style.justifyContent = "flex-start"
		}
		if(document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel')){
			document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.marginLeft = "1rem"
			document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.marginRight ="0rem"
			document.querySelector('.panel.scrollable.slds-utility-panel.slds-grid.slds-grid_vertical.oneUtilityBarPanel').style.right = ""
		}	
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
				queue.parentNode.style.background = color_queue_onQueue
				header.style.background = color_queue_onQueue
				mutationObserver_SoftphoneQueues()
			} 
			else if (queue.textContent === "Available") {
				queue.parentNode.style.background = color_queue_Available
				header.style.background = color_queue_Available
				mutationObserver_SoftphoneQueues()
			} else {
				queue.parentNode.style.background = color_queue_Other
				header.style.background = color_queue_Other
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

	if(request.toggle_yonderColors === "on"){
		mutationObserver_YonderColors("on")
	}

	if(request.toggle_yonderColors === "off"){
		mutationObserver_YonderColors("off")
	}
		
})

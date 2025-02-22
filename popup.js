const toggle_declutterer = document.getElementById("toggle_declutterer");
const toggleButton_declutterer = document.getElementById("overlay_declutterer");
const toggle_softphoneQueues = document.getElementById("toggle_softphoneQueues");
const toggleButton_softphoneQueues = document.getElementById("overlay_softphoneQueues");
const svg = document.getElementById("offButton");
const svg_softphoneQueues = document.getElementById("offButton_softphoneQueues");
const phoneColor_pickUp = document.getElementById("phoneColor_pickUp")
const phoneColor_forward = document.getElementById("phoneColor_forward")

// Returns current tab id
async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab.id;
} 

// Checks local storage and sets the popup element states accordingly
(async () => {
	// Gets and sets the toggle status
	const result = await chrome.storage.local.get(["status_declutterer"])
	if(result.status_declutterer === undefined || result.status_declutterer[0] === "0"){
		toggle_declutterer.value = 0
		svg.setAttribute("stroke", "red");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px red";

	} else if(result.status_declutterer[0] === "1"){
		toggle_declutterer.value = 1
		svg.setAttribute("stroke", "green");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px lime";
	}

/* Commented out for potential future use
	const color_pickUp = await chrome.storage.local.get(["color_pickUp"])
	if(color_pickUp.color_pickUp === undefined){

	}else{
		phoneColor_pickUp.value = color_pickUp.color_pickUp[0]
	}

	const color_forward = await chrome.storage.local.get(["color_forward"])
	if(color_forward.color_forward === undefined){

	}else{
		phoneColor_forward.value = color_forward.color_forward[0]
	}
*/

	const softphoneQueues = await chrome.storage.local.get(["status_softphoneQueues"])
	if(softphoneQueues.status_softphoneQueues === undefined || softphoneQueues.status_softphoneQueues[0] === "0"){
		toggle_softphoneQueues.value = 0
		svg_softphoneQueues.setAttribute("stroke", "red");
		toggleButton_softphoneQueues.style.boxShadow = "0px 0px 5px 2px red";

	} else if(softphoneQueues.status_softphoneQueues[0] === "1"){
		toggle_softphoneQueues.value = 1
		svg_softphoneQueues.setAttribute("stroke", "green");
		toggleButton_softphoneQueues.style.boxShadow = "0px 0px 5px 2px lime";
	}
})()

// Handles state change of the toggle element and inserts styles accordingly
document.getElementById("overlay_declutterer").addEventListener("click", async function(){
	const tab = await getCurrentTab()
	if(toggle_declutterer.value === "0"){
		toggle_declutterer.value = "1"
		svg.setAttribute("stroke", "green");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px lime";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_declutterer: "on"}).catch(() => {});
  	} else if(toggle_declutterer.value === "1"){
		toggle_declutterer.value = "0"
		svg.setAttribute("stroke", "red");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px red";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_declutterer: "off"}).catch(() => {});
    }
	
	chrome.storage.local.set({ "status_declutterer": [toggle_declutterer.value, tab] })
})

document.getElementById("overlay_softphoneQueues").addEventListener("click", async function(){
	const tab = await getCurrentTab()
	
	if(toggle_softphoneQueues.value === "0"){
		toggle_softphoneQueues.value = "1"
		svg_softphoneQueues.setAttribute("stroke", "green");
		toggleButton_softphoneQueues.style.boxShadow = "0px 0px 5px 2px lime";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_softphoneQueues: "on"}).catch(() => {});
  	} else if(toggle_softphoneQueues.value === "1"){
		toggle_softphoneQueues.value = "0"
		svg_softphoneQueues.setAttribute("stroke", "red");
		toggleButton_softphoneQueues.style.boxShadow = "0px 0px 5px 2px red";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_softphoneQueues: "off"}).catch(() => {});
    }
	
	chrome.storage.local.set({ "status_softphoneQueues": [toggle_softphoneQueues.value, tab] })
})

/* Commented out for potential future use
phoneColor_pickUp.addEventListener("change", async function(){
	const tab = await getCurrentTab()
	const currentColor = phoneColor_pickUp.value
	const response = await chrome.tabs.sendMessage(tab, {phoneColor_pickUp: currentColor}).catch(() => {});
	chrome.storage.local.set({ "color_pickUp": [phoneColor_pickUp.value, tab] })
})

phoneColor_forward.addEventListener("change", async function(){
	const tab = await getCurrentTab()
	const currentColor = phoneColor_forward.value
	const response = await chrome.tabs.sendMessage(tab, {phoneColor_forward: currentColor}).catch(() => {});
	chrome.storage.local.set({ "color_forward": [phoneColor_forward.value, tab] })
})
*/

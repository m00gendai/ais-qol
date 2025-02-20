const toggle_declutterer = document.getElementById("toggle_declutterer");
const toggleButton_declutterer = document.getElementById("overlay_declutterer");
const svg = document.getElementById("offButton");

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
	

})()

// Handles state change of the toggle element and inserts styles accordingly
document.getElementById("overlay_declutterer").addEventListener("click", async function(){
	console.log("Click")
	const tab = await getCurrentTab()
	if(toggle_declutterer.value === "0"){
		toggle_declutterer.value = "1"
		svg.setAttribute("stroke", "green");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px lime";
		const response = await chrome.tabs.sendMessage(tab, {toggle_declutterer: "on"}).catch(() => {});
  	}
    else if(toggle_declutterer.value === "1"){
		toggle_declutterer.value = "0"
		svg.setAttribute("stroke", "red");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px red";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_declutterer: "off"}).catch(() => {});
    }
	chrome.storage.local.set({ "status_declutterer": [toggle_declutterer.value, tab] })
})

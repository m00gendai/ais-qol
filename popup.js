const toggle_declutterer = document.getElementById("toggle_declutterer");
const toggle_docker = document.getElementById("toggle_docker");
const toggleButton_declutterer = document.getElementById("overlay_declutterer");
const toggleButton_docker = document.getElementById("overlay_docker");
const svg_declutterer = document.getElementById("offButton_declutterer");
const svg_docker = document.getElementById("offButton_docker");

// Returns current tab id
async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab.id;
} 

// Checks local storage and sets the popup element states accordingly
(async () => {
	
	// Gets and sets the toggle status
	const result = await chrome.storage.local.get(["status_declutterer", "status_docker"])

	if(result.status_declutterer === undefined || result.status_declutterer[0] === "0"){
		toggle_declutterer.value = 0
		svg_declutterer.setAttribute("stroke", "red");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px red";

	} else if(result.status_declutterer[0] === "1"){
		toggle_declutterer.value = 1
		svg_declutterer.setAttribute("stroke", "green");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px lime";
	}

	if(result.status_docker === undefined || result.status_docker[0] === "0"){
		toggle_docker.value = 0
		svg_docker.setAttribute("stroke", "red");
		toggleButton_docker.style.boxShadow = "0px 0px 5px 2px red";

	} else if(result.status_docker[0] === "1"){
		toggle_docker.value = 1
		svg_docker.setAttribute("stroke", "green");
		toggleButton_docker.style.boxShadow = "0px 0px 5px 2px lime";
	}
})()

// Handles state change of the toggle element and inserts styles accordingly
document.getElementById("overlay_declutterer").addEventListener("click", async function(){
	console.log("Click Declutterer")
	const tab = await getCurrentTab()
	if(toggle_declutterer.value === "0"){
		toggle_declutterer.value = "1"
		svg_declutterer.setAttribute("stroke", "green");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px lime";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_declutterer: "on"}).catch(() => {});
  	}
    else if(toggle_declutterer.value === "1"){
		toggle_declutterer.value = "0"
		svg_declutterer.setAttribute("stroke", "red");
		toggleButton_declutterer.style.boxShadow = "0px 0px 5px 2px red";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_declutterer: "off"}).catch(() => {});
    }
	
	chrome.storage.local.set({ "status_declutterer": [toggle_declutterer.value, tab] })
})

document.getElementById("overlay_docker").addEventListener("click", async function(){
	console.log("Click Docker")
	const tab = await getCurrentTab()
	console.log(toggle_docker.value)
	if(toggle_docker.value === "0"){
		toggle_docker.value = "1"
		svg_docker.setAttribute("stroke", "green");
		toggleButton_docker.style.boxShadow = "0px 0px 5px 2px lime";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_docker: "on"}).catch(() => {});
  	}
    else if(toggle_docker.value === "1"){
		toggle_docker.value = "0"
		svg_docker.setAttribute("stroke", "red");
		toggleButton_docker.style.boxShadow = "0px 0px 5px 2px red";
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_docker: "off"}).catch(() => {});
    }
	
	chrome.storage.local.set({ "status_docker": [toggle_docker.value, tab] })
	console.log(`docker set to ${toggle_docker.value}`)
})
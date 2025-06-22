const toggle_declutterer = document.getElementById("toggle_declutterer");
const toggle_docker = document.getElementById("toggle_docker");
const toggle_softphoneQueues = document.getElementById("toggle_softphoneQueues");
const toggle_yonderColors = document.getElementById("toggle_yonderColors")

const toggleButton_declutterer = document.getElementById("overlay_declutterer");
const toggleButton_docker = document.getElementById("overlay_docker");
const toggleButton_softphoneQueues = document.getElementById("overlay_softphoneQueues");
const toggleButton_yonderColors = document.getElementById("overlay_yonderColors");

const indicator_declutterer = document.getElementById("overlay_declutterer_indicatorc:\Users\weberml\OneDrive - Skyguide\Documents\Stuff\Private\JS Tests\Extensions\AIS QoL\popup.html");
const indicator_docker = document.getElementById("overlay_docker_indicator");
const indicator_softphoneQueues = document.getElementById("overlay_softphoneQueues_indicator")
const indicator_yonderColors = document.getElementById("overlay_yonderColors_indicator")

// Returns current tab id
async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab.id;
} 

function setToggleStyle(target, status){ // target: "declutterer" | "docker" | "softphoneQueues", status: "0" | "1"
	if(status === "0"){
		document.getElementById(`overlay_${target}_indicator`).classList.remove("active")
		document.getElementById(`overlay_${target}_indicator`).style.backgroundColor = "rgba(178, 37, 82, 1)"
		return
	}
	if(status === "1"){
		document.getElementById(`overlay_${target}_indicator`).classList.add("active")
		document.getElementById(`overlay_${target}_indicator`).style.backgroundColor = "rgba(70, 145, 155, 1)"
		return
	}
}

function setTabStyle(target){
	const tabs = document.querySelectorAll(".tab_row_item");
    const contentElements = document.querySelectorAll(".tab_body_element");

	const targetIndex = target.id.split("_").pop();

    tabs.forEach(tab => {
        tab.classList.remove("selected");
    });

    contentElements.forEach(content => {
        content.classList.remove("visible");
    });

    target.classList.add("selected");

    const correspondingContentId = `tab_body_${targetIndex}`;
    const correspondingContent = document.getElementById(correspondingContentId);
	if (correspondingContent) { 
        correspondingContent.classList.add("visible");
    }
}

// Checks local storage and sets the popup element states accordingly
(async () => {

	document.getElementById("tab_row_item_aimConnect").classList.add("selected")
	document.getElementById("tab_body_aimConnect").classList.add("visible")

	// Gets and sets the toggle status
	const result = await chrome.storage.local.get(["status_declutterer", "status_docker", "status_softphoneQueues"])

	if(result.status_declutterer === undefined || result.status_declutterer[0] === "0"){
		toggle_declutterer.value = 0
		setToggleStyle("declutterer", "0")

	} else if(result.status_declutterer[0] === "1"){
		toggle_declutterer.value = 1
		setToggleStyle("declutterer", "1")
	}

	if(result.status_docker === undefined || result.status_docker[0] === "0"){
		toggle_docker.value = 0
		setToggleStyle("docker", "0")

	} else if(result.status_docker[0] === "1"){
		toggle_docker.value = 1
		setToggleStyle("docker", "1")
	}

	if(result.status_softphoneQueues === undefined || result.status_softphoneQueues[0] === "0"){
		toggle_softphoneQueues.value = 0
		setToggleStyle("softphoneQueues", "0")

	} else if(result.status_softphoneQueues[0] === "1"){
		toggle_softphoneQueues.value = 1
		setToggleStyle("softphoneQueues", "1")
	}
})()

// Handles state change of the toggle element and inserts styles accordingly
document.getElementById("overlay_declutterer").addEventListener("click", async function(){
	console.log("Click Declutterer")
	const tab = await getCurrentTab()
	if(toggle_declutterer.value === "0"){
		toggle_declutterer.value = "1"
		setToggleStyle("declutterer", "1")
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_declutterer: "on"}).catch(() => {});
  	}
    else if(toggle_declutterer.value === "1"){
		toggle_declutterer.value = "0"
		setToggleStyle("declutterer", "0")
		
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
		setToggleStyle("docker", "1")
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_docker: "on"}).catch(() => {});
  	}
    else if(toggle_docker.value === "1"){
		toggle_docker.value = "0"
		setToggleStyle("docker", "0")
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_docker: "off"}).catch(() => {});
    }
	
	chrome.storage.local.set({ "status_docker": [toggle_docker.value, tab] })
	console.log(`docker set to ${toggle_docker.value}`)
})

document.getElementById("overlay_softphoneQueues").addEventListener("click", async function(){
	const tab = await getCurrentTab()
	
	if(toggle_softphoneQueues.value === "0"){
		toggle_softphoneQueues.value = "1"
		setToggleStyle("softphoneQueues", "1")
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_softphoneQueues: "on"}).catch(() => {});
  	} else if(toggle_softphoneQueues.value === "1"){
		toggle_softphoneQueues.value = "0"
		setToggleStyle("softphoneQueues", "0")
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_softphoneQueues: "off"}).catch(() => {});
    }
	
	chrome.storage.local.set({ "status_softphoneQueues": [toggle_softphoneQueues.value, tab] })
})

document.getElementById("overlay_yonderColors").addEventListener("click", async function(){
console.log("YONDERCLIK")
	const tab = await getCurrentTab()
	console.log(tab)
	if(toggle_yonderColors.value === "0"){
		console.log("YONDERON")
		toggle_yonderColors.value = "1"
		setToggleStyle("yonderColors", "1")
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_yonderColors: "on"}).catch((e) => {console.log(e)});
  	} else if(toggle_yonderColors.value === "1"){
		console.log("YONDEROFF")
		toggle_yonderColors.value = "0"
		setToggleStyle("yonderColors", "0")
		
		const response = await chrome.tabs.sendMessage(tab, {toggle_yonderColors: "off"}).catch((e) => {console.log(e)});
    }
	
	chrome.storage.local.set({ "status_yonderColors": [toggle_yonderColors.value, tab] })
})

document.querySelectorAll(".tab_row_item").forEach(function(item) {
    item.addEventListener("click", function(e) {
        setTabStyle(e.target);
    });
});
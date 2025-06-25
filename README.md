# ais-qol
AIS Quality of Life Chrome Extension

## General Information

This Extension aims to improve the "quality of life" when dealing with browser based software solutions in AIS by improving existing UI and UX.

## Option Toggles

### AIM Connect

#### Case Prinatble View Declutterer
This option aims to improve the default printable view of a Salesforce Case (email). The default view is monocolor and cluttered by a lot of unnecessary information and formatting, which hinders the ability to find relevant information efficiently.

Toggled on, each email will have a button labelled "Better Printable View" on the top of the email. Clicking it will open a new tab, presenting the case in a sturctured and clean manner. This works for both rich text and HTML emails.

Caveats:
- Will need a refresh of Salesforce page if toggled on - this is needed only once initially
- Will process the entire message history, cherry picking of specific emails is not possible - this is due to how Salesforce handles the email data transfers
- If "expand email" is shown, it needs to be expanded first before clicking the Better Printable View button - this is due to how Salesforce handles the email data transfers

#### Dock Softphone Window to the Right
This option simply moves the Softphone interaction popup window from its default left position to the right. This includes the two bottom bar action buttons "Softphone" and "Macros".

Caveats:
- Resizing the window can trigger the interaction popup window to be misaligned. This can be solved by toggling the option off and on again - this is mostly due to the dynamic rendering of the Salesforce components

#### Softphone Colored Queue Status
This option supplements the current queue status information ("On Queue", "Available", "Busy", etc) with colored UI elements. Both the bottom bar "Softphone" button displaying the queue status as well as the Softphone interaction popup window top bar displaying the queue status are colored in the colors of the electronic shift plan:
- Light Blue for "On Queue"
- Green for "Available"
- Red for every other status

Caveats:
None known

#### EXPERIMENTAL: Case Helpdesk Colors
This option adds a visual distinction to identify the Helpdesk queues of Salesforce Cases in the "All Open Cases" inbox Kanban View.
The default Kanban View features the Salesforce Cases as card elements in Kanban columns, featuring the Case ID, Date and Time of receit, Sender Name and message title. The concerned Helpdesk Queue is not mentioned, although it is available if the "Show more Details" button is clicked in the action bar to the top right of the Kanban View. This opens a dialog to the right of the viewport, wher upon selecting a Salesforce Case, additional information is presented, among which is the Helpdesk Queue.

Toggled on, the extension adds a colored bar to the left of a Case card depending on which Helpdesk it corresponds to, increasing efficiency in distinguishing Helpdesk Queues at a glance without the need for further investigation.

Caveats:
- Only works in Kanban View
- Currently not restricted to "All Open Cases" only
- Will run once, needs a refresh of the inbox to run again (this is negible as the inbox does not update dynamically anyways)
- Rather slow, needing several Miliseconds to process each Case card - this is due to the fact that the extension needs to perform convoluted asynchronous operations to retrieve the Helpdesk information as it is not part of the underlying Case metadata


### Yonder

#### Yonder Library Folder Colors
This option aims to supplement the file and folder structure of Yonder by adding colors to distinguish UI elements. 
For the Library column, the default view is monocolor and the only visual cue is a different icon. 
Toggled on, the extension option adds colors to folders and subfolders to increase navigation efficiency by providing visual anchors.

For the Notifications column, the default view is monocolor and there is no visual distinguishing feature to tell the document types apart, except their titles. 
Toggled on, the extension option adds colored bars to the left of a document element depending on the type of document it links to, increasing efficieny in distinguishing the document types at a glance. An explanatory color overview is added to the top of the Library column.

## How it works

### AIM Connect

Key challenges are the incredibly convoluted HTML and DOM structure (seriously its absolutely bonkers), the asynchronous rendering and inconsostent loading of components, the internal APIs and Aura rendering and the Shadow DOM.
DOM nodes are often nested very deeply in layers of wrapper and container elements, some of which also load and render dynamically. Salesforce uses a lot of custom HTML attributes and assigns several IDs dynamically on each render, meaning elements need to be selected based on class names and content. This is especially jarring when it comes to the Shadow DOM that renders components and text data before the actual DOM does so, requiring constant checking and polling for elements and their content. 
Frequent code changes break the extension functionality as entire HTML layouts, structures and naming conventions can be changed without notice.

#### Case Prinatble View Declutterer
This gathers the visible DOM data from the email itself (hence why "expand email" needs to be selected) and the "Case Information" section, aggregates it into an HTML structure and passes this to a new browser tab instance. The email content is essentially copy and pasted, the Case Information is passed into a structured layout.
The extension can handle multiple Case tab instances by checking the active tab in the Salesforce Tab View.

#### Dock Softphone Window to the Right
This simply overwrites the "position" CSS property of the window and the bottom bar button elements.

#### Softphone Colored Queue Status
This runs a Mutaition Observer on the "Softphone" bottom bar button and the Softphone Interaction Popup Window title bar and changes the color depending on the respective text content.

#### EXPERIMENTAL: Case Helpdesk Colors
Essentially this performs several manual steps automatically:
1. Select a Case
2. Take note of the Helpdesk Queue in the "Show more Details" dialog
3. Mark Case according to Helpdesk

Curiously, the "Show more Details" dialog is always present but hidden from view. This relieves the extension from having to perform the opening action manually as well. 
However, due to the fact that it needs to wait until the text content in the dialog has changed (or appears in the first place), there are several asynchronous await steps and recursive polling functions in the operation, causing it to be relatively slow.

### Yonder

Key challenges are the identical class names for the columns and lack of IDs for the HTML elements as well as the convoluted HTML structure that is inherent for a React application. To avoid even more DOM traversing and element counting, some operations such as column targetting are hardcoded instead of gathered from DOM data.

#### Yonder Library Folder Colors

For the Library color, it inspects the present elements for their "variant" HTML property. If it is a folder, it will apply styling. For subfolders it simply analyzes the element hierarchy. A Mutation Observer is needed, since it is a DOM change.
If navigation to a document and back, a Hash Change Event is triggered.

For the Notifications column, it simply looks at the Notification title and styles accordingly. A Mutation Observer is needed for the scrolling action.

The two columns are observed independently.



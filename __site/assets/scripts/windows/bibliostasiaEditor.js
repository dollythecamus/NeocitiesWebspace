import { selectedBiblio , selectedStasia, currentEdit, editBiblio, editStasia } from '/Bibliostasia/bibliostasia.js';

let id = "bibliostasia-editor-window"; // Replace with the actual window ID

document.addEventListener("windowOpened", (event) => {
    
    if (event.detail.id != id)
        return;

    onWindowOpen();
});

function onWindowOpen()
{
    window.addEventListener("biblioSelected", (event) => {
        // Handle the node selection event here
        const biblio = event.detail.biblio;
        // You can update the editor UI or perform other actions with the selected node
        console.log("Node selected:", biblio);
    });
    
    window.addEventListener("stasiaSelected", (event) => {
        // Handle the edge selection event here
        const stasia = event.detail.stasia;
        // You can update the editor UI or perform other actions with the selected edge
        console.log("Edge selected:", stasia);
    });

    window.addEventListener("stoppedSelecting", (event) => {
        // Handle the event when selection is stopped
        console.log("Selection stopped");
        // You can clear the editor UI or perform other actions
    });
}

document.addEventListener("windowClosed", (event) => {

    if (event.id != id)
        return;

    window.removeEventListener("biblioSelected", onBiblioSelected);
    window.removeEventListener("stasiaSelected", onStasiaSelected);
    window.removeEventListener("stoppedSelecting", onStoppedSelecting);
    
});
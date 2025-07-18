import { selectedBiblio , selectedStasia, currentEdit, editBiblio, editStasia } from '/Holodeck/Bibliostasia/bibliostasia.js';

let id = "bibliostasia-editor-window"; // Replace with the actual window ID

document.addEventListener("windowOpened", (event) => {
    
    if (event.detail.id != id)
        return;

    onWindowOpen();
});

function onWindowOpen()
{
    window.addEventListener("biblioSelected", (event) => {
        const biblio = event.detail.biblio;
        console.log("Node selected:", biblio);
    });
    
    window.addEventListener("stasiaSelected", (event) => {
        const stasia = event.detail.stasia;
        console.log("Edge selected:", stasia);
    });

    window.addEventListener("stoppedSelecting", (event) => {
        console.log("Selection stopped");
    });
}

document.addEventListener("windowClosed", (event) => {

    if (event.id != id)
        return;

    window.removeEventListener("biblioSelected", onBiblioSelected);
    window.removeEventListener("stasiaSelected", onStasiaSelected);
    window.removeEventListener("stoppedSelecting", onStoppedSelecting);
    
});
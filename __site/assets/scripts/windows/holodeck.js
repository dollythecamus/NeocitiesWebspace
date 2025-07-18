
let id = "holodeck-window"; // Replace with the actual window ID


document.addEventListener("windowOpened", (event) => {
    
    if (event.detail.id != id)
        return;

    onWindowOpen();
});

function onWindowOpen()
{

}


document.addEventListener("windowClosed", (event) => {

    if (event.id != id)
        return;
    
});
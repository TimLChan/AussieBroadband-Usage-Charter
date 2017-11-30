window.addEventListener ("load", myMain, false);
console.log('HELLO');
function myMain (evt) {
    console.log('HELLO');
    var s = document.createElement("script");
    s.src = chrome.extension.getURL("AussieBB.js");
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
	console.log('HELLO2');
   
}

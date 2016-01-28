'use strict';
//CHANGE FROM VIEW TEXT TO MEDIA
/*
document.getElementById("nav_mult").addEventListener("click", mediaFunction);

function mediaFunction() {


}

// CHANGE FROM MEDIA TO VIEW TEXT
document.getElementById("nav_text").addEventListener("click", textFunction);

function textFunction() {

}


function loadjscssfile(filename, filetype){

    if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

var filesadded="" //list of files already added



function removejscssfile(filename, filetype){
    var removedelements=0
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist using
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
            removedelements+=1
        }
    }
}

function createjscssfile(filename, filetype){
    var fileref=document.createElement('script')

    if (filetype=="css"){ //if filename is an external CSS file
        fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    return fileref
}

    */
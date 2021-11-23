//let labyrintheSize = Object.keys(labyrinthes)[choice-3];

let labyrintheSize;
let labyrinthe;

//----------------------------FONCTION CREATION LABYRINTHE----------------------------------------//
function createLayrinthe(){

    labyrintheSize = Math.floor(Math.random() * 23)+3;
    //labyrintheSize = 5;
    labyrinthe = labyrinthes[labyrintheSize]["ex-2"];

    let containerDiv = document.getElementById("container");
    containerDiv.innerHTML = ""; //---------------réinitailise la div

    for (let i = 0; i < labyrintheSize; i++) {
        let newLine = document.createElement('div');
        newLine.setAttribute("class", "divLine");
        containerDiv.appendChild(newLine);

        for (let j = 0; j < labyrintheSize; j++) {
            let newCase = document.createElement('div');
            newCase.classList.add("divCase");
            let newId = (i*labyrintheSize + j).toString();
            newCase.setAttribute("id", newId);

            //---------------Ajout des bordures--------------
            let lineLab = labyrinthe[newId];
            setBorder(lineLab, newCase);
            newLine.appendChild(newCase);
        }
    }
    //resolveLab(labyrinthe, labyrintheSize);
    console.log(labyrintheSize);
    console.log(labyrinthe);
}

//----------------------------FONCTION AJOUT DES BORDURES----------------------------------------//
function setBorder(lineLab, newCase){
    if (lineLab.walls[0] === true){
        newCase.classList.add("borderTop");
    }
    if (lineLab.walls[1] === true){
        newCase.classList.add("borderRight");
    }
    if (lineLab.walls[2] === true){
        newCase.classList.add("borderBottom");
    }
    if (lineLab.walls[3] === true){
        newCase.classList.add("borderLeft");
    }
    if  (lineLab.entrance === true){
        newCase.classList.add("divStart");
    } else if (lineLab.exit === true) {
        newCase.classList.add("divExit");
    }
}


//----------------------------FONCTION RESOLUTION LABYRINTHE----------------------------------------//
function resolveLab(){

    //---------------Recherche cases départ & fin----------
    let Xstart;
    let Ystart;
    let Xexit;
    let Yexit;
    labyrinthe.forEach(function(element) {
        if(element.entrance === true){
            Xstart = element.posX;
            Ystart = element.posY;
        } else if(element.exit === true){
            Xexit = element.posX;
            Yexit = element.posY;
        }
    });
    let casePosition = Xstart*labyrintheSize + Ystart;
    testCaseNext(casePosition, Xexit, Yexit);
}

//----------------------------FONCTION TEST DES CASES--------------------------------------------//
async function testCaseNext(casePosition, Xexit, Yexit) {

    if (labyrinthe[casePosition].posX !== Xexit || labyrinthe[casePosition].posY !== Yexit) {
        let currentCase;
        let addFirstPath = {"firstPath": true}
        let addSecondPath = {"secondPath": true }
        let tableMove = [
            {wall : 1, casePos : +1},
            {wall : 2, casePos : +labyrintheSize},
            {wall : 3, casePos : -1},
            {wall : 0, casePos :-labyrintheSize}
        ]
        await new Promise((resolve)=>setTimeout(resolve, 100));

        for (let move of tableMove){   //----------------------------"of" On parcourt les valeurs
            if (labyrinthe[casePosition].walls[move.wall] === false && labyrinthe[casePosition + move.casePos].firstPath !== true
            && labyrinthe[casePosition + move.casePos].secondPath !== true && labyrinthe[casePosition + move.casePos].entrance !== true){
                currentCase = document.getElementById((casePosition+move.casePos).toString());
                currentCase.classList.add("divPath");
                Object.assign(labyrinthe[casePosition], addFirstPath);
                return testCaseNext(casePosition+move.casePos, Xexit, Yexit);
            }
        }
        for (let move of tableMove){
            if (labyrinthe[casePosition].walls[move.wall] === false && labyrinthe[casePosition + move.casePos].secondPath !== true
            && labyrinthe[casePosition + move.casePos].entrance !== true){
                currentCase = document.getElementById((casePosition).toString());
                currentCase.classList.add("div2Path");
                Object.assign(labyrinthe[casePosition], addSecondPath);
                return testCaseNext(casePosition+move.casePos, Xexit, Yexit);
            }
        }
    }
}


// function findCasesImpasse(labyrinthe, casePosition) {
//
//     let isImpasse = { "isImpasse": true }
//
//     if (labyrinthe[casePosition].walls === [false, false, false, true] || labyrinthe[casePosition].walls === [false, false, true, false] ||
//         labyrinthe[casePosition].walls === [false, true, false, false] || labyrinthe[casePosition].walls === [true, false, false, false]){
//             Object.assign(labyrinthe[casePosition], isImpasse);
//             let currentCase = document.getElementById((casePosition).toString());
//             currentCase.classList.add("divImpasse");
//     }
// }






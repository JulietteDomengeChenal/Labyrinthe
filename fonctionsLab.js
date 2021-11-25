//let labyrintheSize = Object.keys(labyrinthes)[choice-3];

let labyrintheSize;
let labyrinthe;
let stack;
let goodWay;
let startPosition;

//----------------------------FONCTION CREATION LABYRINTHE----------------------------------------//
function createLayrinthe(){

    labyrintheSize = Math.floor(Math.random() * 23)+3;
    //labyrintheSize = 5;
    labyrinthe = labyrinthes[labyrintheSize]["ex-2"];
    goodWay = [];
    stack = [];

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
    startPosition = Xstart*labyrintheSize + Ystart;
    stack.push(labyrinthe[startPosition]);
    goodWay.push(labyrinthe[startPosition]);
    //testCaseNext(casePosition, Xexit, Yexit);
    testCaseParent(casePosition, Xexit, Yexit);

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

//----------------------------FONCTION CASES PARENTS-DFS-------------------------------------------//
async function testCaseParent(casePosition, Xexit, Yexit) {

    if (labyrinthe[casePosition].posX !== Xexit || labyrinthe[casePosition].posY !== Yexit) {
        let currentCase;
        let addFirstPath = {"firstPath": true}

        let tableMove = [
            {wall : 3, casePos : -1},
            {wall : 0, casePos :-labyrintheSize},
            {wall : 2, casePos : +labyrintheSize},
            {wall : 1, casePos : +1}
        ]

        for (let move of tableMove){   //----------------------------"of" On parcourt les valeurs
            if (labyrinthe[casePosition].walls[move.wall] === false && labyrinthe[casePosition + move.casePos].firstPath !== true){
                currentCase = document.getElementById((casePosition).toString());
                currentCase.classList.add("div2Path");

                Object.assign(labyrinthe[casePosition], addFirstPath);
                let addParent = {"parent": casePosition}
                Object.assign(labyrinthe[casePosition+move.casePos], addParent);
                let addPosition = {"labPosition": casePosition+move.casePos}
                Object.assign(labyrinthe[casePosition+move.casePos], addPosition);

                stack.push(labyrinthe[casePosition+move.casePos]);

                if (labyrinthe[casePosition+move.casePos].exit === true) {
                    let lastCasePosition = goodWay[goodWay.length-1].labPosition;
                    showPath(lastCasePosition);
                    return;
                }
            }
        }
        casePosition = stack[stack.length-1].labPosition;
        for (let move of tableMove){
            if (labyrinthe[casePosition].walls[move.wall] === false && labyrinthe[casePosition + move.casePos].firstPath === true) {
                stack.pop();
            }
        }
        goodWay.push(labyrinthe[casePosition]);
        // console.log(stack);
        // console.log(goodWay);
        await new Promise((resolve)=>setTimeout(resolve, 100));
        testCaseParent(casePosition, Xexit, Yexit);
    }
}

//----------------------------FONCTION DESSINE CHEMIN--------------------------------------------//
function showPath(lastCasePosition){
    if(lastCasePosition !== startPosition){
        let goodWayLine;
        for (let way of goodWay) {
            if(way.labPosition === lastCasePosition){
                goodWayLine = way;
            }
        }
        let singleCase = document.getElementById(lastCasePosition );
        singleCase.classList.add("divWay");
        lastCasePosition = goodWayLine.parent;
        return showPath(lastCasePosition);
    }
}
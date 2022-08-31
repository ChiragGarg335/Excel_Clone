for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell= document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
            let address=addressBar.value;
            let [activeCell,cellProp]=activecell(address);
            let enteredData=activeCell.innerText;

            if(enteredData === cellProp.value ) return;
            cellProp.value=enteredData;
            removeChildFromParent(cellProp.formula);
            cellProp.formula="";
            updateChildrenCells(address);
        })
    }
}

let formulaBar=document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown",(e)=>{
    let inputFormula = formulaBar.value;
    if (e.key==="Enter" && inputFormula){

        let address=addressBar.value;
        let [cell,cellProp]=activecell(address);
        if(inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);
        
        addChildToGraphComponet(inputFormula,address);

        let isCyclic = isGraphCyclic(graphComponentMatrix);
        if(isCyclic === true){
            alert("Your Formula is Cyclic");
            removeChildFromGraphComponent(inputFormula,address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);

        setCEllUIandCellProp(evaluatedValue,inputFormula,address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
        console.log(sheetDB)
    }
})

function addChildToGraphComponet(formula,childAddress){
    let [crid,ccid]= decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i]);

            graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
}
}

function removeChildFromGraphComponent(formula,childAddress){
    let [crid,ccid]= decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i]);

            graphComponentMatrix[prid][pcid].pop();
        }
}
}

function updateChildrenCells(parentAddress){
    let [parentCell,parentCellProp]=activecell(parentAddress);
    let children = parentCellProp.children;

    for(let i=0;i<children.length;i++){
        let childAddress = children[i];
        let[childCell ,childCellProp]= activecell(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue= evaluateFormula(childFormula);
        setCEllUIandCellProp(evaluatedValue,childFormula,childAddress)
        updateChildrenCells(childAddress);
    }

}

function addChildToParent(formula){
    let childAddress= addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [parentCell,parentCellProp]=activecell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula){
    let childAddress= addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [parentCell,parentCellProp]=activecell(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
}

function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >=65 && asciiValue <=90){
            let [cell,cellProp]=activecell(encodedFormula[i]);
            encodedFormula[i]=cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula)
}

function setCEllUIandCellProp(evaluatedValue,formula, address){
    let [cell,cellProp]=activecell(address);

    cell.innerText=evaluatedValue;

    cellProp.value=evaluatedValue;
    cellProp.formula=formula;
}

let ctrlKey;
document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey;
});
document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCells(cell);
  }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    if (!ctrlKey) return;
    if (rangeStorage.length >= 2) {
      handleSelectedCellsUI();
      rangeStorage = [];
    }

    cell.style.border = "3px solid #218c74";

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]);
  });
}

function handleSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(
      `.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`
    );
    cell.style.border = "1px solid lightgrey";
  }
}

let copyData = [];

copyBtn.addEventListener("click", (e) => {
  if (rangeStorage < 2) return;
  copyData = [];

  for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
    let copyRow = [];
    for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
      let cellProp = sheetDB[i][j];
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }
  handleSelectedCellsUI();
});

cutBtn.addEventListener("click", (e) => {
  if (rangeStorage < 2) return;
  
  cutDefaultValues();
  handleSelectedCellsUI();
});

function cutDefaultValues(){
    for (let i = rangeStorage[0][0]; i <= rangeStorage[1][0]; i++) {
        for (let j = rangeStorage[0][1]; j <= rangeStorage[1][1]; j++) {
          let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    
          let cellProp = sheetDB[i][j];
          cellProp.value = "";
          cellProp.bold = false;
          cellProp.italic = false;
          cellProp.underline = false;
          cellProp.fontSize = 14;
          cellProp.fontFamily = "monospace";
          cellProp.fontColor = "#000000";
          cellProp.BGcolor = "#000000";
          cellProp.alignment = "left";
          cell.click();
        }
      }
}

pasteBtn.addEventListener("click", (e) => {
  if (rangeStorage < 2) return;
  let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

  let address = addressBar.value;
  let [strow, stcol] = decodeRIDCIDFromAddress(address);

  for (let i = strow, r = 0; i <= strow + rowDiff; i++, r++) {
    for (let j = stcol, c = 0; j <= stcol + colDiff; j++, c++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell) {
        continue;
      }
      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];

      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.BGcolor = data.BGcolor;
      cellProp.alignment = data.alignment;

      cell.click();
    }
  }
});

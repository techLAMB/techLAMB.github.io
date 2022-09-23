import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";


//PROPERTYTABLE
import { IFCSPACE } from 'web-ifc';
// import { IFCQUANTITYAREA } from 'web-ifc';

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xffffff),
});


//Loading models
async function loadIfc(url) {
  await viewer.IFC.setWasmPath("../../../");
  const model = await viewer.IFC.loadIfcUrl(url);
  await viewer.shadowDropper.renderShadow(model.modelID);
  viewer.context.renderer.postProduction.active = true;


    // PROPERTY TABLE
    
    
    const spacesID = await viewer.IFC.getAllItemsOfType(0, IFCSPACE);
    for(let i = 0; i < spacesID.length; i++) {
      const spaceID = spacesID[i];
      const spaceProperties = await viewer.IFC.getProperties(0, spaceID, true);
      const spaceName = spaceProperties.LongName.value;

      const areaID = spaceProperties.psets[4].Quantities[0].value;
      const areaProperties = await viewer.IFC.getProperties(0, areaID, true);
      const areaQuantity = Math.round(areaProperties.AreaValue.value);
      
      const table = document.getElementById('spaces-table');
      const body = table.querySelector('tbody');
      addPropertyEntry(body, spaceName, areaQuantity);
      }
    }

  loadIfc("../../../models/typea.ifc");



// Selector

window.ondblclick = async () => {
  const result = await viewer.IFC.selector.pickIfcItem();
  if (!result) return;
  const { modelID, id } = result;
  const props = await viewer.IFC.getProperties(modelID, id, true, false);
  console.log(props);
};
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();


// Deselect

window.onkeydown = (event) => {
    if (event.code === 'KeyC') {
        viewer.IFC.selector.unpickIfcItems();
        viewer.IFC.selector.unHighlightIfcItems();
    }
};




//spaces

// PROPERTY TABLE//


// function createSpaceNameEntry(table) {
//   const row = document.createElement('tr');
//   table.appendChild(row);

//   const spaceName = document.createElement('td');
//   spaceName.textContent = 'Ruimte'; 
//   row.appendChild(spaceName);

//   const areaQuantity = document.createElement('td');
//   areaQuantity.textContent = 'GO'; 
//   row.appendChild(areaQuantity);
// }

function addPropertyEntry(table, name, value) {
  const row = document.createElement('tr');
  table.appendChild(row);

  if(name === null || name === undefined) name = "Unknown";
  if(name.value) name = name.value;
  name = decodeIFCString(name);

  const spaceName = document.createElement('td');
  spaceName.textContent = name;
  row.appendChild(spaceName);

  if(value === null || value === undefined) value = "Unknown";
  if(value.value) value = value.value;
  value = decodeIFCString(value);

  const areaQuantity = document.createElement('td');
  areaQuantity.textContent = value + ' m2';
  row.appendChild(areaQuantity);
}

function decodeIFCString (ifcString) {
  const ifcUnicodeRegEx = /\\X2\\(.*?)\\X0\\/uig;
  let resultString = ifcString;
  let match = ifcUnicodeRegEx.exec (ifcString);
  while (match) {
      const unicodeChar = String.fromCharCode (parseInt (match[1], 16));
      resultString = resultString.replace (match[0], unicodeChar);
      match = ifcUnicodeRegEx.exec (ifcString);
  }
  return resultString;
}


// PROPERTY MENU

// window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

// window.ondblclick = async () => {
//     const result = await viewer.IFC.selector.highlightIfcItem();
//     if (!result) return;
//     const { modelID, id } = result;
//     const props = await viewer.IFC.getProperties(modelID, id, true, false);
//     createPropertiesMenu(props);
// };

// const propsGUI = document.getElementById("ifc-property-menu-root");

// function createPropertiesMenu(properties) {
//     console.log(properties);

//     removeAllChildren(propsGUI);

//     const psets = properties.psets;
//     const mats = properties.mats;
//     const type = properties.type;

//     delete properties.psets;
//     delete properties.mats;
//     delete properties.type;


//     for (let key in properties) {
//         createPropertyEntry(key, properties[key]);
//     }

// }

// function createPropertyEntry(key, value) {
//     const propContainer = document.createElement("div");
//     propContainer.classList.add("ifc-property-item");

//     if(value === null || value === undefined) value = "undefined";
//     else if(value.value) value = value.value;

//     const keyElement = document.createElement("div");
//     keyElement.textContent = key;
//     propContainer.appendChild(keyElement);

//     const valueElement = document.createElement("div");
//     valueElement.classList.add("ifc-property-value");
//     valueElement.textContent = value;
//     propContainer.appendChild(valueElement);

//     propsGUI.appendChild(propContainer);
// }

// function removeAllChildren(element) {
//     while (element.firstChild) {
//         element.removeChild(element.firstChild);
//     }
// }


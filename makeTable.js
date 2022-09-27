const redrawTable = () => {
  const table = document.getElementById("tab");
  //clear the table to make the way to rebuild it
  table.innerText = "";
  const head = table.createTHead();
  const hrow = head.insertRow();
  const cell0 = hrow.insertCell(0);
  cell0.colSpan = "2";
  cell0.innerHTML = "Property";
  const cell1 = hrow.insertCell();
  cell1.colSpan = "2";
  cell1.innerHTML = "Value";
  const body = table.createTBody();
  AddRow(body, "Red", "R", "r", defaultParticleProperties.color[0]);
  AddRow(body, "Green", "G", "g", defaultParticleProperties.color[1]);
  AddRow(body, "Blue", "B", "b", defaultParticleProperties.color[2]);
  AddRow(body, "Transparency", "T", "t", defaultParticleProperties.color[3]);
  AddRow(body, "Size", "+", "-", defaultParticleProperties.size);
  AddRow(body, "Emitter X", "d", "a", emitter.location[0]);
  AddRow(body, "Emitter Y", "w", "s", emitter.location[1]);
  AddRow(table, "Particle Speed", "↑", "↓", defaultParticleProperties.speed);
  AddRow(table, "Direction", "←", "→", calulateAngle());
  AddRow(table, "Shape", "H", "h", defaultParticleProperties.Shape);
};

const AddRow = (table, variableName, increase, decrease, value) => {
  const row = table.insertRow();
  const incr = row.insertCell();
  const variable = row.insertCell();
  const val = row.insertCell();
  const decr = row.insertCell();

  incr.appendChild(document.createTextNode(increase));
  variable.appendChild(document.createTextNode(variableName));
  val.appendChild(document.createTextNode(Math.round(value * 100) / 100));
  decr.appendChild(document.createTextNode(decrease));
};

const calulateAngle = () => {
  let theta =
    (Math.atan2(
      defaultParticleProperties.directionBias[1],
      defaultParticleProperties.directionBias[0]
    ) *
      180) /
    Math.PI;
  if (theta < 0) {
    theta = 360 + theta;
  }
  return theta;
};

window.addEventListener("load", redrawTable);

window.addEventListener("load", () => {
  const table = document.getElementById("tab");
  AddRow(table, "Red", "R", "r", defaultParticleProperties.color[0]);
  AddRow(table, "Green", "G", "g", defaultParticleProperties.color[1]);
  AddRow(table, "Blue", "B", "b", defaultParticleProperties.color[2]);
  AddRow(table, "Transparency", "T", "t", defaultParticleProperties.color[3]);
  AddRow(table, "Size", "+", "-", defaultParticleProperties.size);
  AddRow(table, "Emmiter X", "d", "a", emmitter.location[0]);
  AddRow(table, "Emmitter Y", "w", "s", emmitter.location[1]);
  AddRow(
    table,
    "Particle Speed",
    "up",
    "down",
    defaultParticleProperties.speed
  );
  AddRow(
    table,
    "Direction",
    "<-",
    "->",
    Math.atan2(
      defaultParticleProperties.directionBias[1],
      defaultParticleProperties.directionBias[0]
    )*180/Math.PI
  );
  AddRow(table, "Shape", )
});

const AddRow = (table, variableName, increase, decrease, value) => {
  const row = table.insertRow();
  const incr = row.insertCell();
  const variable = row.insertCell();
  const val = row.insertCell();
  const decr = row.insertCell();

  incr.appendChild(document.createTextNode(increase));
  variable.appendChild(document.createTextNode(variableName));
  val.appendChild(document.createTextNode(value));
  decr.appendChild(document.createTextNode(decrease));
};

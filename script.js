
function generaLista() {
  const input = document.getElementById("input").value;
  const items = input.split(/,|\n/).map(i => i.trim()).filter(i => i !== "");
  const listaCategorizzata = {};

  for (const categoria in categorie) {
    listaCategorizzata[categoria] = [];
  }

  items.forEach(item => {
    let trovato = false;
    for (const categoria in categorie) {
      if (categorie[categoria].some(i => i.toLowerCase() === item.toLowerCase())) {
        listaCategorizzata[categoria].push(item);
        trovato = true;
        break;
      }
    }
    if (!trovato) {
      listaCategorizzata["Altro"].push(item);
    }
  });

  const listaDiv = document.getElementById("lista");
  listaDiv.innerHTML = "";
  for (const categoria in listaCategorizzata) {
    if (listaCategorizzata[categoria].length > 0) {
      const blocco = document.createElement("div");
      const titolo = document.createElement("h3");
      titolo.textContent = categoria;
      blocco.appendChild(titolo);

      const ul = document.createElement("ul");
      listaCategorizzata[categoria].forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });

      blocco.appendChild(ul);
      listaDiv.appendChild(blocco);
    }
  }
}

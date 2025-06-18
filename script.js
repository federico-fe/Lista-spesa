
import { categorie } from './ingredienti.js';

function salvaInLocale(lista) {
  localStorage.setItem("listaSpesa", JSON.stringify(lista));
}

function caricaDaLocale() {
  return JSON.parse(localStorage.getItem("listaSpesa")) || [];
}

function generaLista() {
  const input = document.getElementById("input").value;
  const items = input.split(/,|\n/).map(i => i.trim()).filter(i => i !== "");
  const listaCategorizzata = {};
  for (const cat in categorie) listaCategorizzata[cat] = [];

  items.forEach(item => {
    let trovato = false;
    for (const cat in categorie) {
      if (categorie[cat].some(i => i.toLowerCase() === item.toLowerCase())) {
        listaCategorizzata[cat].push(item);
        trovato = true;
        break;
      }
    }
    if (!trovato) listaCategorizzata["Altro"].push(item);
  });

  const listaDiv = document.getElementById("lista");
  listaDiv.innerHTML = "";
  for (const cat in listaCategorizzata) {
    if (listaCategorizzata[cat].length > 0) {
      const blocco = document.createElement("div");
      const titolo = document.createElement("h3");
      titolo.textContent = cat;
      blocco.appendChild(titolo);
      const ul = document.createElement("ul");
      listaCategorizzata[cat].forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.onclick = () => li.classList.toggle("comprato");
        const btn = document.createElement("button");
        btn.textContent = "✕";
        btn.onclick = (e) => {
          e.stopPropagation();
          li.remove();
        };
        li.appendChild(btn);
        ul.appendChild(li);
      });
      blocco.appendChild(ul);
      listaDiv.appendChild(blocco);
    }
  }
  salvaInLocale(items);
}

function cancellaLista() {
  document.getElementById("lista").innerHTML = "";
  localStorage.removeItem("listaSpesa");
}

function condividiWhatsApp() {
  const blocchi = document.querySelectorAll("#lista > div");
  let testo = "🛒 Lista della Spesa:\n";
  blocchi.forEach(blocco => {
    const cat = blocco.querySelector("h3").textContent;
    testo += `\n*${cat}:*\n`;
    blocco.querySelectorAll("li").forEach(li => {
      testo += `- ${li.childNodes[0].textContent}\n`;
    });
  });
  const url = "https://wa.me/?text=" + encodeURIComponent(testo);
  window.open(url, "_blank");
}

window.onload = () => {
  const salvata = caricaDaLocale();
  if (salvata.length > 0) {
    document.getElementById("input").value = salvata.join(", ");
    generaLista();
  }
};

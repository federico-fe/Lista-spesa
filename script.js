
function aggiornaDashboard() {
  const dashboard = document.getElementById("dashboard");
  const lista = document.getElementById("lista");
  const categorie = lista.querySelectorAll("h3").length;
  const ingredienti = lista.querySelectorAll("li").length;
  dashboard.innerHTML = `📊 <strong>Ingredienti:</strong> ${ingredienti} | <strong>Categorie:</strong> ${categorie}`;
}

function rimuoviIngrediente(button) {
  const li = button.parentElement;
  li.remove();
  aggiornaDashboard();
}

function stampaLista() {
  window.print();
}

function pulisciTutto() {
  document.getElementById("input").value = "";
  document.getElementById("lista").innerHTML = "";
  document.getElementById("status").textContent = "";
  document.getElementById("dashboard").innerHTML = "";
  localStorage.removeItem("spesaInput");
  localStorage.removeItem("categoriePersonalizzate");
}

function condividiWhatsApp() {
  const lista = document.getElementById("lista");
  if (!lista || lista.innerText.trim() === "") {
    alert("Genera prima una lista da condividere.");
    return;
  }

  const testo = Array.from(lista.querySelectorAll("h3")).map(h3 => {
    const categoria = h3.innerText;
    const items = Array.from(h3.nextElementSibling.querySelectorAll("li"))
      .map(li => "- " + li.innerText.replace(/🗑️/, '').trim())
      .join("\n");
    return categoria + ":\n" + items;
  }).join("\n\n");

  const url = "https://wa.me/?text=" + encodeURIComponent("Ecco la mia lista della spesa:\n\n" + testo);
  window.open(url, "_blank");
}

function aggiornaEditorCategorie(categorie) {
  const editor = document.getElementById("categorie-editor");
  editor.innerHTML = "";

  for (const [cat, items] of Object.entries(categorie)) {
    if (cat === "Altro") continue;

    const wrapper = document.createElement("div");
    wrapper.className = "categoria-block";

    const label = document.createElement("input");
    label.value = cat;
    label.placeholder = "Nome categoria";

    const input = document.createElement("input");
    input.value = items.join(", ");
    input.placeholder = "Ingredienti (es. pomodoro, carota)";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "🗑️";
    removeBtn.onclick = () => wrapper.remove();

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);
    editor.appendChild(wrapper);
  }
}

function aggiungiCategoria() {
  aggiornaEditorCategorie({...getCategorieFromEditor(), "Nuova Categoria": []});
}

function getCategorieFromEditor() {
  const blocks = document.querySelectorAll("#categorie-editor .categoria-block");
  const categorie = {};

  blocks.forEach(block => {
    const inputs = block.querySelectorAll("input");
    const nome = inputs[0].value.trim();
    const keywords = inputs[1].value.split(",").map(w => w.trim()).filter(Boolean);
    if (nome && keywords.length > 0) {
      categorie[nome] = keywords;
    }
  });

  return categorie;
}

function salvaCategorieDaEditor() {
  const cat = getCategorieFromEditor();
  cat["Altro"] = [];
  localStorage.setItem("categoriePersonalizzate", JSON.stringify(cat));
  return cat;
}

function generaLista() {
  const input = document.getElementById("input").value;
  const listaDiv = document.getElementById("lista");
  const status = document.getElementById("status");

  const categorie = salvaCategorieDaEditor();
  localStorage.setItem("spesaInput", input);

  listaDiv.innerHTML = "";
  status.textContent = "";

  const righe = input.toLowerCase().split(/\n|,|;/).map(r => r.trim()).filter(Boolean);
  const listaCategorizzata = {};

  Object.keys(categorie).forEach(cat => listaCategorizzata[cat] = []);
  listaCategorizzata["Altro"] = [];

  righe.forEach(item => {
    let trovato = false;
    for (const [categoria, paroleChiave] of Object.entries(categorie)) {
      if (paroleChiave.some(parola => item.includes(parola))) {
        listaCategorizzata[categoria].push(item);
        trovato = true;
        break;
      }
    }
    if (!trovato) {
      const esistenti = Object.keys(categorie).filter(k => k !== "Altro");
      const opzioni = esistenti.map((cat, idx) => `  ${idx + 1}. ${cat}`).join("\n");
      const sceltaInput = prompt(`L'ingrediente "${item}" non appartiene a nessuna categoria.\n\nCategorie disponibili:\n${opzioni}\n\n👉 Scrivi il numero corrispondente per assegnarlo, oppure inserisci un nome nuovo per creare una nuova categoria.\nLascia vuoto per ignorare:`);

      let scelta = "";
      const sceltaNum = parseInt(sceltaInput);
      if (!isNaN(sceltaNum) && sceltaNum >= 1 && sceltaNum <= esistenti.length) {
        scelta = esistenti[sceltaNum - 1];
      } else {
        scelta = sceltaInput;
      }

      if (scelta && scelta.trim() !== "") {
        if (!listaCategorizzata[scelta]) {
          listaCategorizzata[scelta] = [];
          categorie[scelta] = [item];
        } else {
          categorie[scelta].push(item);
        }
        listaCategorizzata[scelta].push(item);
      } else {
        listaCategorizzata["Altro"].push(item);
      }
    }
  });

  for (const [categoria, items] of Object.entries(listaCategorizzata)) {
    if (items.length > 0) {
      const sezione = document.createElement("div");
      sezione.innerHTML = `<h3>${categoria}</h3><ul>` +
        items.map(i => `<li>${i} <button onclick="rimuoviIngrediente(this)">🗑️</button></li>`).join("") +
        "</ul>";
      listaDiv.appendChild(sezione);
    }
  }

  status.textContent = "✅ Lista generata con successo!";
  status.style.color = "green";
  listaDiv.scrollIntoView({ behavior: "smooth" });
  aggiornaDashboard();
}

window.onload = function() {
  const savedCategorie = localStorage.getItem("categoriePersonalizzate");
  const savedInput = localStorage.getItem("spesaInput");

  if (savedInput) {
    document.getElementById("input").value = savedInput;
  }

  const defaultCategorie = {
    "Verdura e Frutta": ["pomodoro", "insalata", "mele", "banane", "carote"],
    "Carne e Pesce": ["pollo", "manzo", "pesce", "salsiccia"],
    "Latticini": ["latte", "formaggio", "burro", "yogurt"],
    "Dispensa": ["pasta", "riso", "olio", "farina", "zucchero"]
  };

  let data;
  try {
    data = savedCategorie ? JSON.parse(savedCategorie) : defaultCategorie;
  } catch {
    data = defaultCategorie;
  }
  aggiornaEditorCategorie(data);

  if (savedInput) {
    generaLista();
  }
}

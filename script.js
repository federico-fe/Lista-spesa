
const categorie = {
  "Frutta": ["Mela", "Banana", "Arancia", "Kiwi", "Ananas", "Fragole", "Pera", "Uva", "Ciliegie", "Mango",
    "Melone", "Anguria", "Mandarino", "Limone", "Cocco", "Fichi", "Avocado", "Pompelmo"],
  "Verdura": ["Pomodoro", "Zucchina", "Carota", "Cipolla", "Aglio", "Lattuga", "Radicchio", "Peperoni", "Spinaci",
    "Melanzana", "Cetriolo", "Cavolo", "Broccoli", "Finocchio", "Zucca", "Porro", "Barbabietola", "Rucola"],
  "Carne": ["Pollo", "Manzo", "Maiale", "Tacchino", "Vitello", "Salsiccia", "Prosciutto cotto", "Prosciutto crudo",
    "Speck", "Bresaola", "Wurstel", "Mortadella"],
  "Pesce": ["Salmone", "Tonno", "Merluzzo", "Orata", "Branzino", "Gamberetti", "Alici", "Cozze", "Vongole", "Polpo",
    "Calamari", "Sardine"],
  "Surgelati": ["Piselli surgelati", "Spinaci surgelati", "Minestrone", "Patatine fritte", "Pizza surgelata",
    "Gelato confezionato", "Crocchette", "Bastoncini di pesce", "Verdure grigliate"],
  "Latticini e Uova": ["Latte", "Yogurt", "Burro", "Uova", "Mozzarella", "Parmigiano", "Formaggio Brie", "Feta",
    "Ricotta", "Grana Padano", "Crescenza"],
  "Pane e Prodotti da Forno": ["Pane", "Panini", "Grissini", "Crackers", "Brioche", "Fette biscottate", "Croissant",
    "Torta", "Pizza", "Taralli"],
  "Pasta e Riso": ["Pasta", "Spaghetti", "Riso", "Gnocchi", "Lasagne", "Couscous", "Farro", "Orzo", "Ravioli", "Tortellini"],
  "Conserve e Dispensa": ["Passata di pomodoro", "Olio d'oliva", "Aceto", "Sale", "Zucchero", "Farina", "Caffè", "Tè",
    "Spezie", "Lievito", "Fagioli in scatola", "Ceci", "Tonno in scatola", "Marmellata", "Miele", "Brodo granulare"],
  "Dolci e Snack": ["Cioccolato", "Biscotti", "Caramelle", "Patatine", "Torte confezionate", "Gelato", "Barrette",
    "Snack salati", "Popcorn", "Merendine"],
  "Bevande": ["Acqua", "Succo di frutta", "Bibite", "Birra", "Vino", "Aperitivi", "Centrifugati", "Energy drink"],
  "Alimenti Internazionali": ["Tofu", "Salsa di soia", "Noodles", "Tortillas", "Salsa teriyaki", "Wasabi",
    "Pane naan", "Hummus", "Falafel", "Kimchi"],
  "Prodotti per la pulizia": ["Detersivo piatti", "Detersivo lavatrice", "Candeggina", "Sapone mani", "Spugne",
    "Panni microfibra", "Ammorbidente", "Sgrassatore", "Spray vetri", "Deodorante ambiente"],
  "Igiene personale": ["Shampoo", "Bagnoschiuma", "Dentifricio", "Spazzolino", "Carta igienica", "Fazzoletti",
    "Deodorante", "Cotton fioc", "Lamette", "Crema corpo"],
  "Abbigliamento": ["Calze", "Maglietta", "Pantaloni", "Biancheria intima", "Cappello", "Giacca", "Scarpe",
    "Sciarpa", "Guanti", "Pigiama"],
  "Cancelleria": ["Penna", "Matita", "Evidenziatore", "Quaderno", "Colla", "Forbici", "Nastro adesivo",
    "Raccoglitore", "Pennarelli", "Post-it", "Righello"],
  "Animali domestici": ["Croccantini", "Cibo umido", "Lettiera", "Paletta", "Ciotola", "Collare", "Giochi",
    "Cuccia", "Tappetini igienici"],
  "Altro": []
};

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

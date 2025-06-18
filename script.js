
// Database integrato di ingredienti e categorie
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
  "Pasta e Riso": ["Pasta", "Spaghetti", "Riso", "Gnocchi", "Lasagne", "Couscous", "Farro", "Orzo", "Ravioli",
                   "Tortellini"],
  "Conserve e Dispensa": ["Passata di pomodoro", "Olio d'oliva", "Aceto", "Sale", "Zucchero", "Farina", "Caffè", "Tè",
                          "Spezie", "Lievito", "Fagioli in scatola", "Ceci", "Tonno in scatola", "Marmellata", "Miele",
                          "Brodo granulare"],
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

// Funzione per generare la lista
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

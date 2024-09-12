// Fonction pour récupérer les données depuis un fichier CSV
function getData(csvFilePath) {
  // Récupère le contenu du fichier CSV
  return fetch(csvFilePath)
    .then((response) => {
      //  Vérifie si le chargement du fichier CSV a réussi
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du fichier CSV");
      }
      return response.text();
    })
    .then((data) => {
      // Convertit le contenu du fichier CSV en un tableau d'objets
      const rows = data.split("\n");
      const headers = rows[0].split(",");
      const arrayData = rows.slice(1).map((row) => {
        const cols = row.split(",");
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = cols[index];
        });
        return obj;
      });

      return arrayData;
    })
    .catch((error) => console.error("Erreur :", error));
}

// Classe Product pour créer et afficher les produits
class Product {
  constructor(nom, image, prix, categorie) {
    this.nom = nom;
    this.image = image;
    this.prix = prix;
    this.categorie = categorie;
  }

  /**
   * Calcule le montant total du panier, en HT et en TTC, en prenant en compte
   * les prix des produits dans le tableau listeProduits.
   */
  static calculateTotalPrice(listeProduits) {
    const totalHT = listeProduits.reduce((acc, { prix }) => acc + parseFloat(prix), 0);
    const totalTTC = totalHT / 1.206;

    return ` 
      <div class="total-hors-tva"><p>TOTAL HT:</p> ${totalTTC.toFixed(2)}€ </div>
      <div class="total-ttc"><p>TOTAL TTC:</p>${totalHT.toFixed(2)}€</div>
    `;
  }

  // Génère le HTML pour un produit
  generateHTML() {
    return `
        <div class="card">
          <!-- Image du produit -->
          <div class="image_container">
              <img src="statics/${this.image}" alt="${this.nom}">
          </div>

          <!-- Titre du produit -->
          <div class="title">
              <span>${this.nom}</span>
          </div>

          <!-- Prix et bouton Ajouter au panier -->
          <div class="action">
              <!-- Prix du produit -->
              <div class="price">
                  <span>${this.prix}</span>
              </div>

              <!-- Bouton Ajouter au panier -->
              <button class="cart-button" onclick="createProduct('${this.nom}', '${this.image}', '${this.prix}');displayShoppingCardInCart()">
                  <span>Add to cart</span>
              </button>
          </div>
      </div>
      `;
  }

  generateHTMLShoppingCard() {
    return `

  <div class="product-header">

      <div class="product-line">
          <p class="hearder-name">Nom</p>
          <p class="hearder-price">Prix</p>
          <p class="hearder-quantity">Quantité</p>

          <p class="product-name">${this.nom}</p>
          <p class="product-price">${this.prix}</p>
          <p class="product-quantity"></p>
          <img src="statics/${this.image}" alt="${this.nom}">
      </div>
                
  </div>
  

  `;
  }

  display() {
    const categoryWrapper = document.querySelector(".products-wrapper");
    categoryWrapper.insertAdjacentHTML("beforeend", this.generateHTML());
  }

  displayShoppingCard() {
    const elemensInCard = document.querySelector(".shopping-card");
    elemensInCard.insertAdjacentHTML(
      "afterbegin",
      this.generateHTMLShoppingCard()
    );
  }
}

const shoppingCart = [];

/**
 * Ajoute un produit au panier.
 */
function createProduct(nom, image, prix) {
  // Ajoute le produit au panier.
  const product = new Product(nom, image, prix);
  shoppingCart.push(product);

  // Affiche le nombre d'articles dans le panier.
  document.getElementById("nombre-articles").style.display = "block";
  document.getElementById(
    "nombre-articles"
  ).innerHTML = `${shoppingCart.length}`;

  console.log("Panier :", shoppingCart);
}

/**
 * Affiche le panier dans l'élément HTML .shopping-card.
 * Prend les éléments du panier (un tableau d'objets Product) et les affiche
 * dans l'élément HTML .shopping-card en utilisant la méthode
 * generateHTMLShoppingCard() de l'objet Product, ainsi que le montant total
 * du panier.
 */
function displayShoppingCardInCart() {
  const shoppingCartElement = document.querySelector(".shopping-card");

  // Génère le code HTML pour le panier en utilisant la méthode
  // generateHTMLShoppingCard() de l'objet Product.
  const html = shoppingCart.map((product) =>
    product.generateHTMLShoppingCard()
  ).join("");
  // Affiche le montant total du panier.
  const totalPrice = Product.calculateTotalPrice(shoppingCart);

  // Affiche le code HTML généré dans l'élément HTML .shopping-card.
  shoppingCartElement.innerHTML = html + totalPrice;
}


class Categorie {
  constructor(name) {
    this.name = name;
  }

  // Génère le code HTML pour la catégorie
  generateHTML() {
    return `
            <section class="${this.name}-wrapper">
            <p>${this.name}</p>
            <div class="products-wrapper">
            </div>
        </section>
     `;
  }

  // Génère le code HTML pour le menu de navigation
  generateNav() {
    return `
                <li id="${this.name}"><a href="#">${this.name}</a></li>
            `;
  }

  // Affiche la catégorie dans la page
  display() {
    // Insertion dynamique de la section dans le main
    const categoryWrapper = document.querySelector("main");
    categoryWrapper.insertAdjacentHTML("beforeend", this.generateHTML());
    // Insertion dynamique du nav
    const nav = document.querySelector("nav ul");
    nav.insertAdjacentHTML("beforeend", this.generateNav());
  }
}

// Récupère les données du fichier CSV et crée les objets Product correspondants.
// Les produits sont ensuite affichés dans la page en fonction de leur catégorie.
const categories = new Set();
getData("data.csv").then((data) => {
  // Parcourt les données et stocke les noms de catégorie dans un Setpour éviter les doublons.
  data.forEach((productData) => categories.add(productData["Catégorie"]));

  // Parcourt le Set des catégories et crée un objet Categorie pour chaque catégorie.
  // Appelle la méthode display() pour afficher la catégorie dans la page.
  categories.forEach((category) => {
    const categorie = new Categorie(category);
    categorie.display();
  });
});

// Charge les données du fichier CSV et crée les objets Product correspondants.
// Les produits sont ensuite affichés dans la page en fonction de leur catégorie.
getData("data.csv").then((data) => {
  data.forEach((productData) => {
    const product = new Product(
      productData["Nom"],
      productData["Image"],
      productData["Prix"],
      productData["Catégorie"]
    );

    // Affiche le produit dans la section correspondant à sa catégorie
    const categoryWrapper = document.querySelector(
      `.${product.categorie}-wrapper .products-wrapper`
    );
    if (categoryWrapper) {
      categoryWrapper.insertAdjacentHTML("beforeend", product.generateHTML());
    }
  });
});

// Lorsque l'utilisateur clique sur un élément de la liste, affiche ou cache les
// éléments correspondants dans la section. Si l'élément cliqué est "all", affiche tous les éléments.
document.addEventListener("DOMContentLoaded", () => {
  const ul = document.querySelector("ul");

  if (ul) {
    ul.addEventListener("click", (e) => {
      const li = e.target.closest("li"); // Récupère l'élément de liste cliqué
      if (li) {
        const categoryId = li.id; // Récupère l'ID de l'élément cliqué

        // Si l'ID est "all", affiche tous les éléments
        if (categoryId === "all") {
          // Affiche tous les éléments
          document.querySelectorAll("main section").forEach((element) => {
            element.style.display = "";
          });
        } else {
          // Sinon, masquer tous les éléments
          document.querySelectorAll("main section").forEach((element) => {
            element.style.display = "none";
          });

          // Afficher uniquement les éléments avec la classe correspondant à l'ID
          document
            .querySelectorAll(`.${categoryId}-wrapper`)
            .forEach((element) => {
              element.style.display = "";
            });
        }
      }
    });
  }
});

/**
 * Fonction qui permet d'afficher le panier en cliquant sur l'image panier.
 */
function shoppingCardVisibility() {
  const panier = document.getElementById("panier");
  if (panier.style.display === "block") {
    // Masquer le panier
    panier.style.display = "none";
  } else {
    // Afficher le panier
    panier.style.transition = "all 0.5s ease-in-out";
    panier.style.display = "block";
  }
}

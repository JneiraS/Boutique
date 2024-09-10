// Fonction pour récupérer les données depuis un fichier CSV
function getData(csvFilePath) {
  return fetch(csvFilePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du fichier CSV");
      }
      return response.text();
    })
    .then((data) => {
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

  generateHTML() {
    return `
                  <div class="card">
                    <div class="image_container">
                        <img src="statics/${this.image}" alt="${this.nom}">
                    </div>
                    <div class="title">
                        <span>${this.nom}</span>
                    </div>
                 
                    <div class="action">
                        <div class="price">
                            <span>${this.prix}</span>
                        </div>

                        <button class="cart-button">
                            <span>Add to cart</span>
                        </button>
                    </div>
                </div>
                `;
  }

  display() {
    const categoryWrapper = document.querySelector(".products-wrapper");
    categoryWrapper.insertAdjacentHTML("beforeend", this.generateHTML());
  }
}

class Categorie {
  constructor(name) {
    this.name = name;
  }

  generateHTML() {
    return `
            <section class="${this.name}-wrapper">
            <p>${this.name}</p>
            <div class="products-wrapper">
            </div>
        </section>
     `;
  }

  display() {
    const categoryWrapper = document.querySelector("main");
    categoryWrapper.insertAdjacentHTML("beforeend", this.generateHTML());
  }
}

// Récupération des catégories depuis le CSV
const categories = new Set();
getData("data.csv").then((data) => {
  data.forEach((productData) => categories.add(productData["Catégorie"]));

  categories.forEach((category) => {
    const categorie = new Categorie(category);
    categorie.display();
  });
});

// Récupération des produits depuis le CSV
getData("data.csv").then((data) => {
  data.forEach((productData) => {
    const product = new Product(
      productData["Nom"],
      productData["Image"],
      productData["Prix"],
      productData["Catégorie"]
    );

    const categoryWrapper = document.querySelector(
      `.${product.categorie}-wrapper .products-wrapper`
    );
    if (categoryWrapper) {
      categoryWrapper.insertAdjacentHTML("beforeend", product.generateHTML());
    }
  });
});
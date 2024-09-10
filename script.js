// Fonction pour récupérer les données depuis un fichier CSV
function getData(csvFilePath) {
  return fetch(csvFilePath)
    .then((response) => response.text())
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
    });
}
// Classe Product pour créer et afficher les produits
class Product {
  constructor(nom, image, prix) {
    this.nom = nom;
    this.image = image;
    this.prix = prix;
  }

  generateHTML() {
    return `
                  <div class="card">
                    <div class="image_container">
                        <img src="statics\\${this.image}" alt="${this.nom}">
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

// Utilisation des données pour créer et afficher des objets Product
getData("data.csv").then((data) => {
  data.forEach((productData) => {
    const product = new Product(
      productData["Nom"],
      productData["Image"],
      productData["Prix"]
    );
    product.display();
  });
});

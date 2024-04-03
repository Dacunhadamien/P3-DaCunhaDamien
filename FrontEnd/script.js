// Récupération des travaux sur l'API
//Si les travaux sont déjà dans le local storage, on les récupère
let works = JSON.parse(localStorage.getItem("works"));

//Sinon, on va les chercher sur l'API
if (works === null) {
  works = await fetch("http://localhost:5678/api/works")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("works", JSON.stringify(data));
    })
    .then(() => {
      return JSON.parse(localStorage.getItem("works"));
    })
    .catch((error) => console.log(error));
}

//Fonction pour afficher sur la page les travaux disponibles dans l'API, récupérés dans la constante works
function genererWork(works) {
  //Avant de générer un nouvel affichage, on remet à zéro la class gallery
  document.querySelector(".gallery").innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    //On crée les élements HTML
    let workFigure = document.createElement("figure");
    let workImage = document.createElement("img");
    let workFigcaption = document.createElement("figcaption");

    //On fait coincider les valeurs des balises avec celles présentes sur works
    workImage.src = works[i].imageUrl;
    workImage.alt = works[i].title;
    workFigcaption.innerHTML = works[i].title;

    //On intègre nos balises avec leurs valeurs dans l'HTML
    workFigure.appendChild(workImage);
    workFigure.appendChild(workFigcaption);
    document.querySelector(".gallery").appendChild(workFigure);
  }
}

// A l'ouverture de la page, on affiche tout les travaux dispo dans l'API
genererWork(works);

//Gestion des filtres

let workFiltre = works;

//Récupération de la liste des boutons
const listeBoutons = document.querySelectorAll(".bouton-filtres button");

//On écoute le click sur les boutons
for (let i = 0; i < listeBoutons.length; i++) {
  let bouton = listeBoutons[i];
  bouton.addEventListener("click", function (event) {
    //Selon le bouton sur lequel on clique, on filtre les photos par categoryId grâce à la variable workFiltre
    switch (event.target) {
      case listeBoutons[0]:
        workFiltre = works;
        break;
      case listeBoutons[1]:
        workFiltre = works.filter(function (works) {
          return works.categoryId === 1;
        });

        break;
      case listeBoutons[2]:
        workFiltre = works.filter(function (works) {
          return works.categoryId === 2;
        });

        break;
      case listeBoutons[3]:
        workFiltre = works.filter(function (works) {
          return works.categoryId === 3;
        });
        break;
    }
    // On génère un nouvel affichage des travaux selon filtres
    genererWork(workFiltre);
  });
}

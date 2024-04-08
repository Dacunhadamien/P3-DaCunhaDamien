// ------------------Récupération des travaux sur l'API-----------------------------

//Si les travaux sont déjà dans le local storage, on les récupère

//Sinon, on va les chercher sur l'API

let works = await fetch("http://localhost:5678/api/works")
  .then((response) => {
    return response.json();
  })
  .catch((error) => console.log(error));

//Fonction pour afficher sur la page les travaux disponibles dans l'API, récupérés dans la constante works
async function genererWork(works) {
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

//---------------------Gestion ouverture de la page ------------------

genererWork(works);

// Si on est connecté, on passe tout les éléments actifs en inactif, et on masque "login"
let token = localStorage.getItem("token");
if (token !== null) {
  const elmtsInactifs = document.querySelectorAll(".inactive");
  const elmtsActifs = document.querySelectorAll(".active");
  for (let i = 0; i < elmtsInactifs.length; i++) {
    let elmtsActuel = elmtsInactifs[i];
    elmtsActuel.classList.remove("inactive");
    elmtsActuel.classList.add("active");
    document.getElementById("edit").style.display = "flex";
    document.querySelector(".div-header").style.marginTop = "80px";
  }
  for (let i = 0; i < elmtsActifs.length; i++) {
    let elmtsActuel = elmtsActifs[i];
    elmtsActuel.classList.add("inactive");
    elmtsActuel.classList.remove("active");
  }
  // Gestion du logout
  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("token");
    location.reload();
  });
}

//---------------------Gestion des filtres-------------------

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

//----------------------Gestion modale--------------------

function genererWorkmodale(works) {
  let divGalleryPhoto = document.querySelector(".galleryModal");
  divGalleryPhoto.innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    //On crée les élements HTML
    let workArticle = document.createElement("article");
    let workImage = document.createElement("img");
    // On indique les différents paramètres de nos balises
    workImage.src = works[i].imageUrl;
    workImage.alt = works[i].title;
    workImage.classList.add("galleryPhotos");
    //On donne aux boutons "trash" un id correspondant à l'id des works, utilisé plus tard dans la suppression des travaux.
    workArticle.innerHTML = `<button id="${works[i].id}" class="trash"><i class="fa-solid fa-trash-can"></i></button>`;
    //On intègre nos balises avec leurs valeurs dans l'HTML
    workArticle.appendChild(workImage);
    divGalleryPhoto.appendChild(workArticle);
  }
}

// On ne génère les travaux dans la modale qu'au click sur le lien

document.querySelector(".js-modal").addEventListener("click", genererWorkmodale(works));

//-------------Gestion suppression des travaux sur la modale -------------------

const listeBoutonsModale = document.querySelectorAll(".trash");

for (let i = 0; i < listeBoutonsModale.length; i++) {
  let bouton = listeBoutonsModale[i];
  bouton.addEventListener("click", async function (event) {
    event.preventDefault();
    await fetch(`http://localhost:5678/api/works/${event.currentTarget.id}`, {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + token,
      },
    })
      .then(localStorage.removeItem("works"))
      .then(genererWork(works))
      .catch((error) => console.log(error));
  });
}

//-----------------------Ajouter photo------------------------------------
const formulairePhoto = document.querySelector(".ajout-photo");
formulairePhoto.addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("titre").value;
  const categoryId = document.getElementById("categorie").value;
  const image = document.getElementById("input-fichier").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
  formData.append("image", image);

  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: formData,
  })
    .then(genererWork(works))
    .catch((error) => console.log(error));
});

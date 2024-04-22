//--------------------Gestion log-in / log out----------------------

let token = localStorage.getItem("token");
// Gestion du log-in
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

// -----------------Gestion des filtres -----------------------------
document.querySelector(".bouton-filtres").addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    // Active le bouton cliqué et appelle la fonction chargerWorks avec l'id de la catégorie.
    definirBoutonActif(event.target);
    const categoryId = Number(event.target.value);
    chargerWorks(categoryId);
  }
});

chargerWorks();

//-----------------------Ajouter photo------------------------------------

const valider = document.getElementById("valider");
valider.disabled = true;
const inputs = document.querySelectorAll(".ajout-photo input");

// Gestion du bouton valider
inputs.forEach((element) => {
  element.addEventListener("change", function () {
    if (document.getElementById("titre").value !== "" && document.getElementById("input-fichier").files.length > 0) {
      valider.disabled = false;
    } else {
      valider.disabled = true;
    }
  });
});

// Gestion de l'affichage de l'image préselectionnée
document.getElementById("input-fichier").addEventListener("change", () => {
  let fichierImage = document.getElementById("input-fichier");
  const img = document.createElement("img");
  img.src = URL.createObjectURL(fichierImage.files[0]);
  document.querySelectorAll(".section-choix-image i, label, p").forEach((element) => element.classList.add("inactive"));
  document.querySelector(".section-choix-image").appendChild(img);
});

// Suite au submit, on génère le form data que l'on envoie à l'API, puis on génère les works
document.querySelector(".ajout-photo").addEventListener("submit", envoiFormData);

// ------------------Fonctions-----------------------------

async function chargerWorks(categoryId = 0) {
  await fetch("http://localhost:5678/api/works")
    .then((response) => {
      return response.json();
    })
    .then((works) => {
      //Gestion de la partie gallerie
      document.querySelector(".gallery").innerHTML = "";
      const filterData = works.filter((work) => work.categoryId === Number(categoryId) || categoryId === 0);

      const figures = filterData.map(({ id, imageUrl, title }) => {
        const figure = document.createElement("figure");
        figure.dataset.id = id;

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        return figure;
      });
      figures.forEach((figure) => document.querySelector(".gallery").appendChild(figure));
      //Gestion de la partie modale
      document.querySelector(".galleryModal").innerHTML = "";
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
        document.querySelector(".galleryModal").appendChild(workArticle);
      }
      //Gestion suppression des travaux sur la modale
      const listeBoutonsModale = document.querySelectorAll(".trash");
      for (let i = 0; i < listeBoutonsModale.length; i++) {
        let bouton = listeBoutonsModale[i];
        bouton.addEventListener("click", suppressionTravaux);
      }
    })
    .catch((error) => console.log(error));
}

async function envoiFormData(e) {
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
    .then(alert(`Vous avez correctement importé ${title}`))
    .then(chargerWorks())
    .then(regenererAffichageImport)
    .catch((error) => console.log(error));
}

async function suppressionTravaux(event) {
  event.preventDefault();
  await fetch(`http://localhost:5678/api/works//${event.currentTarget.id}`, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      Authorization: "Bearer " + token,
    },
  })
    .then(chargerWorks())
    .catch((error) => console.log(error));
}

function regenererAffichageImport() {
  document.querySelectorAll(".section-choix-image i, label, p").forEach((element) => element.classList.remove("inactive"));
  let image = document.querySelector(".section-choix-image img");
  image.remove();
  document.querySelector(".ajout-photo").reset();
  valider.disabled = true;
}

function definirBoutonActif(button) {
  // Enlève la classe "selected" de tous les boutons "bouton-filtres".
  document.querySelectorAll(".bouton-filtres button").forEach((b) => b.classList.remove("selected"));
  // Ajoute la classe "selected" au bouton cliqué.
  button.classList.add("selected");
}

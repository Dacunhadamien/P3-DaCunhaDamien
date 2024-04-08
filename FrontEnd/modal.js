//La variable modal représentera la modale active (null si aucune, comme au lancement de la page)
let modal = null;
//Fonction pour ouvrir la modale
const openModal = function (e) {
  e.preventDefault();
  //On récupère la cible du click
  const target = document.querySelector(e.target.getAttribute("href"));
  //On modifie le code HTML de la cible pour l'afficher et modifier les informations liées à l'accessibilité
  target.style.display = null;
  target.setAttribute("aria-hidden", "false");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".closeButton").addEventListener("click", closeModal);
  modal.querySelector(".modal-wrapper").addEventListener("click", stopPropagation);
  modal.querySelector(".previousButton").addEventListener("click", stopPropagation);
  modal.querySelector("form").addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  //On évite des comportements problématiques si la modale n'est pas ouverte
  if (modal === null) return;
  e.preventDefault();
  //On modifie le code HTML de la cible pour la masquer et modifier les informations liées à l'accessibilité
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-modal", "false");
  modal.removeEventListener("click", closeModal);
  // On remet la valeur modal à null car la modale est désormais fermée
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

// On ferme la modale lors de l'appuie sur la touche Escape
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal(e);
  }
});
//On récupère le lien et on écoute le click pour lancer la fonction d'ouverture de la modale
const lienModal = document.querySelector(".js-modal");
lienModal.addEventListener("click", openModal);

//--------------Modale 2-----------------
document.querySelector(".overline button").addEventListener("click", function (e) {
  document.getElementById("wrapper1").style.display = "none";
  document.getElementById("wrapper2").style.display = "flex";
});

document.querySelector(".previousButton").addEventListener("click", function (e) {
  document.getElementById("wrapper1").style.display = "flex";
  document.getElementById("wrapper2").style.display = "none";
});

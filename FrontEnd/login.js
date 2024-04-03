//On récupère les champs de saisies email et password ainsi que le formulaire
let emailUtilisateur = document.getElementById("email");
let mdpUtilisateur = document.getElementById("mdp");
const connexionUtilisateur = document.querySelector("form");

// On écoute le submit sur le formulaire
connexionUtilisateur.addEventListener("submit", function (event) {
  //On prévient le rechargement de la page par défaut
  event.preventDefault();
  //On prépare l'objet à envoyer à l'API
  const logUtilisateur = {
    email: emailUtilisateur.value,
    password: mdpUtilisateur.value,
  };
  // On passe l'objet en JSON pour envoi
  const chargeUtile = JSON.stringify(logUtilisateur);
  // On envoi les identifiants au format JSON
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: chargeUtile,
  })
    // On récupére la réponse de l'API
    .then((response) => {
      return response.json();
    })
    // Puis on vérifie que l'on a bien un ID et Token, preuve que email et password sont bon. Sinon, on alerte avec un message d'erreur.
    .then((data) => {
      if (!data.userId) {
        alert("Erreur identifiant ou mot de passe incorrect");
      } else {
        // On enregistre ID et token dans le local storage, puis on renvoi sur la page index
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

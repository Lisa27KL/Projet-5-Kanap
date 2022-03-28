// Récupération du numéro de commande par son URL
let urlConfirmationOrder = new URLSearchParams(document.location.search);
let orderIdNumber = urlConfirmationOrder.get("id-order");

// Récupérer l'id orderId pour pouvoir afficher le numéro de commande 
const orderId =document.querySelector("#orderId");

// Affichage du numéro de commande
orderId.innerHTML = orderIdNumber;

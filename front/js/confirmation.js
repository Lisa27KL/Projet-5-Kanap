// Récupération du numéro de commande par son URL
let urlConfirmationOrder = new URLSearchParams(document.location.search);
let orderIdNumber = urlConfirmationOrder.get("id-order");
const orderId =document.querySelector("#orderId");
orderId.innerHTML = orderIdNumber;

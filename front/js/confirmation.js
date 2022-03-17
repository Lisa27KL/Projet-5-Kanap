// Récupération de orderId et insertion dans le HTML
document.getElementById("orderId").innerHTML = JSON.stringify(localStorage.getItem("orderId"));

// Effacer tout le localStorage
localStorage.clear();

//Variables pour calculer la quantité d'article 
let calculTotalQuantity = [];
let totalQuantity = document.getElementById("totalQuantity");

//Variables pour calculer le prix total 
let calculTotalPrice = [];
let totalPrice =document.getElementById("totalPrice");

// Variable pour calculer le total de : calculTotalPrice et calculTotalQuantity
const reducer = (accumulator, currentValue) => accumulator + currentValue;

//Initialisation du localStorage 
let orderLocalStorage = localStorage.getItem("infoCart") != null ? JSON.parse(localStorage.getItem("infoCart")) : null;

// Variable pour récupérer la classe où je vais injecter le code HTML
const positionCartProduct = document.querySelector("#cartAndFormContainer");


// Affichage du panier vide
if(orderLocalStorage === null || orderLocalStorage.length === 0){

    const emptyBasket = `
    <div id="cartAndFormContainer">
        <div> Où sont vos articles ? Votre panier est vide !</div>
    </div>`;

    positionCartProduct.innerHTML = emptyBasket;
}
else{
    // Si le panier n'est pas vide : afficher les produits qui sont stockés dans le localStorage
    orderLocalStorage.forEach((articles) => {
        // Je récupère des infos dans l'API à partir de l'idProduct 
         fetch( `http://localhost:3000/api/products/${articles.idProduct}`)
            .then((res) =>  res.json())
 
            .then((couch) => {
                const cartItems = `
                <article class="cart__item" data-id="${articles.idProduct}" data-color="${articles.colorProduct}">
                    <div class="cart__item__img">
                        <img src="${couch.imageUrl}" alt="${couch.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                        <h2>${couch.name}</h2>
                        <p>${articles.colorProduct}</p>
                        <p>${couch.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${articles.quantityProduct}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                        </div>
                    </div>
                </article>
                `;
                    document
                        .getElementById("cart__items")
                        .insertAdjacentHTML("afterbegin", cartItems);


                //--------------------Calcul quantité d'articles dans le panier            
                calculTotalQuantity.push( parseInt(`${articles.quantityProduct}`));
                totalQuantity.innerHTML = calculTotalQuantity.reduce(reducer,0);                
            

                // -------------------Montant total du panier ---------------------------------------------------                          
                calculTotalPrice.push( parseInt(`${articles.quantityProduct}`) * parseInt(`${couch.price}`));
                totalPrice.innerHTML = calculTotalPrice.reduce(reducer,0);                              

 
                // -------------Supprimer un article du panier ET du localStorage---------------------------
                 
                const deletedItem = document.getElementsByClassName("deleteItem");
 
                for(let btn = 0; btn < deletedItem.length; btn++){
                     
                    deletedItem[btn].addEventListener("click", (btnEvent) => {
                        btnEvent.preventDefault();

                        const parentD = btnEvent.target.closest("[data-id]");
                        
                        let newOrderLocalStorage = orderLocalStorage.filter( 
                        (productLocal)=> productLocal.idProduct !== parentD.dataset.id || productLocal.colorProduct !== parentD.dataset.color
                        );

                        localStorage.setItem("infoCart", JSON.stringify(newOrderLocalStorage));
                        alert("L'article a bien été supprimé du panier");
                        location.reload();
                    })
                 };

                // -----------------------Modifier la quantité -----------------------------
                const changeQuantity = document.getElementsByClassName("itemQuantity");

                for(let c = 0; c < changeQuantity.length; c++){
                    
                    changeQuantity[c].addEventListener("change", (changeEvent) => {
                        changeEvent.preventDefault();

                        const parentQ = changeEvent.target.closest("[data-id]");
                        
                        const oldQuantity = orderLocalStorage.find(
                            (first) => first.idProduct === parentQ.dataset.id && first.colorProduct === parentQ.dataset.color);

                        let newQuantity = changeQuantity[c].value;                            
                        
                        if (newQuantity < 1 || newQuantity > 100){
                            return alert("Choisissez une quantité entre 1 et 100");
                        };
                        
                        oldQuantity.quantityProduct = newQuantity;
                        localStorage.setItem("infoCart", JSON.stringify(orderLocalStorage));
                        location.reload();
                    });
                };
            })
        .catch((error) => {
            console.error('Error du server: le problème sera réglé ultérieurement', error);
        });
    });
}


//---------------------------------------------------FORMULAIRE------------------------------

// Selection le formulaire dans le DOM
const form = document.querySelector(".cart__order__form");

// Création des Expressions Régulières (RegExp)
let namesRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç' -]{2,}$");
let addressRegExp = new RegExp("^[0-9]{1,4}[a-zA-Z0-9àâäéèêëïîôöùûüç '.,-]{3,}$");
let cityRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç' -]{3,60}$");
let emailRegExp = new RegExp("^[a-zA-Z0-9àâäéèêëïîôöùûüç.-_]+[@]{1}[a-zA-Z0-9.-_]+[.][a-z]{2,10}$");


// ********** Validation du PRENOM **********
const firstName = document.getElementById("firstName");

function validationFirstName(){
    return namesRegExp.test(firstName.value);
};

// Ecouter la modification du PRENOM --------------------
firstName.addEventListener("change", function (e) {

    let errorMsg = firstName.nextElementSibling;
    validationFirstName(firstName) ? errorMsg.innerHTML ="Prénom Valide" :  errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Prénom correctement";
});


// ********** Validation du NOM **********
const lastName = document.getElementById("lastName");

function validationLastName(){
    return namesRegExp.test(lastName.value);
};

// Ecouter la modification du NOM --------------------
lastName.addEventListener("change", function (e) {
    validationLastName(lastName);

    let errorMsg = lastName.nextElementSibling;

    if(validationLastName(lastName)){
        errorMsg.innerHTML ='Nom Valide';
    }
    else { 
        errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Nom correctement";
    }
});


// ********** Validation de  l'ADRESSE **********
const address = document.getElementById("address")

function validationAddress(){
    return addressRegExp.test(address.value) 
};

// Ecouter la modification de l'ADRESSE --------------------
address.addEventListener("change", function (e) {
    let errorMsg = address.nextElementSibling;
    validationAddress(address) ? errorMsg.innerHTML ='Adresse Valide' : errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Adresse";
});


// ********** Validation de la VILLE **********
const city = document.getElementById("city");

function validationCity(){
    return cityRegExp.test(city.value)
};

// Ecouter la modification de la VILLE --------------------
city.addEventListener("change", function(e) {
    validationCity(city);
    let errorMsg = city.nextElementSibling;

    if(validationCity(city)){
        errorMsg.innerHTML ="Ville Valide";
    
    }else{ 
        errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Ville";
    }
});


//********** Validation de l'EMAIL **********
const email = document.getElementById("email");

function validationEmail (e){
    return emailRegExp.test(email.value);
};

// Ecouter la modification de l'EMAIL --------------------
email.addEventListener("change", function (){
    let errorMsg = email.nextElementSibling;
    validationEmail(email) ? errorMsg.innerHTML ="Email Valide" : errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Email";
});


// Ecouter la soumission du FORMULAIRE via le bouton ------------------------------
const btnForm = document.getElementById("order");

btnForm.addEventListener("click", (validEvent) => {
    validEvent.preventDefault();

    // Récupération des valeurs du formulaire
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const email = document.getElementById("email").value;

    // Vérification de validité du formulaire 
    let formVerified =
    validationFirstName(firstName) && 
    validationLastName(lastName) && 
    validationAddress(address) && 
    validationCity(city) && 
    validationEmail(email);

    // Contrôler la validité du formulaire avant l'envoie dans le LS
    if(!formVerified){
        alert("Veuillez remplir le formulaire correctement")

    } else {
        // Mettre formulaireValues dans le local storage
        alert("Vos informations ont bien été enregistrées")

        // Construire un tableau de produits commandé
        let idsProducts = [];
        for(let i = 0; i < orderLocalStorage.length; i++){
            idsProducts.push(orderLocalStorage[i].idProduct);
        }

        // Mettre les produits du panier ainsi que le formulaire dans un objet à envoyer vers l'API
        const orderDetails ={
            products : idsProducts,
            contact : {
                firstName: firstName,
                lastName : lastName,
                address : address,
                city : city,
                email : email,
            },
        };

        // Envoie de l'objet infosToSend vers le serveur
        fetch("http://localhost:3000/api/products/order",{
            method: "POST",
            body : JSON.stringify(orderDetails),
            headers: {
                "Accept" : "Application/JSON",
                "Content-Type": "Application/JSON"},
            })
    
            .then((response) => response.json())     
            .then((data)=> {
            
                // Récupération de data-orderId 
                orderIdNumber = `${data.orderId}`;

                // Nettoyer le LocalStorage après validation de la commande
                localStorage.clear();
                
                // lien vers la page confirmation
                window.location.href = `./confirmation.html?id-order=${orderIdNumber}`;
            })
            .catch((error)=>{
                console.error('Error du server: le problème sera réglé ultérieurement', error);
                alert("Un problème a été détecté au niveau du fetch, il sera réglé très prochainement !");
            })
    };
});
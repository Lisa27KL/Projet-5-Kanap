//Initialisation du localStorage 
let orderLocalStorage = JSON.parse(localStorage.getItem("infoCart"));

// Variable pour récupérer la classe où je vais injecter le code HTML
const positionCartProduct = document.querySelector("#cartAndFormContainer");

//Variables pour calculer le prix total 
let calculTotalQuantity = [];
let totalQuantity = document.getElementById("totalQuantity");

//Variables pour calculer le prix total 
let calculTotalPrice = [];
let totalPrice =document.getElementById("totalPrice");


//
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// Si le panier est vide : afficher le panier est vide

if(orderLocalStorage == undefined || orderLocalStorage == 0){
    const emptyBasket = `
    <div id="cartAndFormContainer">
        <div> Oupss... Votre panier est vide </div>
    </div>`;

    positionCartProduct.innerHTML = emptyBasket;

}else{
    // Si le panier n'est pas vide : afficher les produits dans le localStorage

    orderLocalStorage.forEach((elt) => {
       // Je récupère des infos dans l'API à partir de l'idProduct 
        fetch( `http://localhost:3000/api/products/${elt.idProduct}`)
            .then((elements) =>  elements.json())

            .then((elements) => {
                const cartItems = `
                <article class="cart__item" data-id="${elt.idProduct}" data-color="${elt.colorProduct}">
                    <div class="cart__item__img">
                        <img src="${elements.imageUrl}" alt="${elements.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                        <h2>${elements.name}</h2>
                        <p>${elt.colorProduct}</p>
                        <p>${elements.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${elt.quantityProduct}">
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
                calculTotalQuantity.push( parseInt(`${elt.quantityProduct}`));
                totalQuantity.innerHTML = calculTotalQuantity.reduce(reducer,0);                
               

                // -------------------Montant total du panier ---------------------------------------------------                          
                calculTotalPrice.push( parseInt(`${elt.quantityProduct}`) * parseInt(`${elements.price}`));
                totalPrice.innerHTML = calculTotalPrice.reduce(reducer,0);                              


                // -------------Supprimer un article du panier ET du localStorage---------------------------
                
                const deletedItem = document.getElementsByClassName("deleteItem");

                for(let btn = 0; btn < deletedItem.length; btn++){
                    
                    deletedItem[btn].addEventListener("click", (btnEvent) => {
                        btnEvent.preventDefault();

                        const parentD = btnEvent.target.closest("[data-id]");

                        let newLocalStorage = orderLocalStorage.filter( 
                           (productLocal)=> productLocal.idProduct !== parentD.dataset.id || productLocal.colorProduct !== parentD.dataset.color
                        );

                        localStorage.setItem("infoCart", JSON.stringify(newLocalStorage));
                        alert(`L'article a bien été supprimé du panier`);
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

                        let newQuantity = changeQuantity[c].valueAsNumber;                            
                        
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

// Création des RegExp
let namesRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç' -]{2,}$");
let addressRegExp = new RegExp("^[0-9]{1,4}[a-zA-Z0-9àâäéèêëïîôöùûüç '.,-]{3,}$");
let cityRegExp = new RegExp("^[a-zA-Z0-9àâäéèêëïîôöùûüç' -]{3,60}$");
let emailRegExp = new RegExp("^[a-zA-Z0-9àâäéèêëïîôöùûüç.-_]+[@]{1}[a-zA-Z0-9.-_]+[.][a-z]{2,10}$");


// Ecouter la modification du PRENOM ------------------------------
form.firstName.addEventListener("change", function () {
    validFirstName(this);
});

// ***** Validation du PRENOM *****
const validFirstName = function(inputFirstName){

    let errorMsg = inputFirstName.nextElementSibling;

    if(namesRegExp.test(form.firstName.value)){
        errorMsg.innerHTML ='Prénom Valide';

    }else if (namesRegExp.test(form.firstName.value) == ""){
        errorMsg.innerHTML ="Veuillez renseignez votre Prénom";

    }else{
        errorMsg.innerHTML ="Prénom Invalide";
    }
};


// Ecouter la modification du NOM ------------------------------
form.lastName.addEventListener("change", function () {
    validLastName(this);
});

const validLastName = function(inputLastName){

     // ***** Validation du NOM *****
     let errorMsg = inputLastName.nextElementSibling;

     if(namesRegExp.test(form.lastName.value)){
         errorMsg.innerHTML ='Nom Valide';

    }else if(namesRegExp.test(form.lastName.value) == "") { 
        errorMsg.innerHTML ="Veuillez renseignez votre Nom";

    }else{
         errorMsg.innerHTML ="Nom Invalide";
    }
};


// Ecouter la modification de l'ADRESSE ------------------------------
form.address.addEventListener("change", function () {
    validAddress(this);
});

// ***** Validation de  l'ADRESSE *****
const validAddress = function(inputAddress){

    let errorMsg = inputAddress.nextElementSibling;

    if(addressRegExp.test(form.address.value)){
        errorMsg.innerHTML ='Adresse Valide';

    }else if(addressRegExp.test(form.address.value) == "") { 
        errorMsg.innerHTML ="Veuillez renseignez votre Adresse";

    }else{
        errorMsg.innerHTML ="Adresse Invalide";
    }
};


// Ecouter la modification de la VILLE ------------------------------
form.city.addEventListener("change", function() {
    validCity(this);
});

const validCity = function(inputCity){

    let errorMsg = inputCity.nextElementSibling;

    if(cityRegExp.test(form.city.value)){
        errorMsg.innerHTML ="Ville Valide";

    }else if(cityRegExp.test(form.city.value) == "") { 
        errorMsg.innerHTML ="Veuillez renseignez votre Ville";

    }else{
        errorMsg.innerHTML ="Ville Invalide";
    }
};


// Ecouter la modification de l'EMAIL ------------------------------
form.email.addEventListener("change", function (){
    validEmail(this);
});

//***** Validation email *****
const validEmail = function(inputEmail){

    let errorMsg = inputEmail.nextElementSibling;

    if(emailRegExp.test(form.email.value)){
        errorMsg.innerHTML ="Email Valide";

    }else if(emailRegExp.test(form.email.value) == "") { 
        errorMsg.innerHTML ="Veuillez renseignez votre Email";

    }else{
        errorMsg.innerHTML ="Email Invalide";
    }
};


// Ecouter la soumission du FORMULAIRE via le bouton ------------------------------
const btnForm = document.getElementById("order");
btnForm.addEventListener("click", (validEvent) => {
    validEvent.preventDefault();


    // Vérification de validité du formulaire 
    let validForm = namesRegExp.test(form.firstName.value) && 
    namesRegExp.test(form.lastName.value )&& 
    addressRegExp.test(form.address.value) && 
    cityRegExp.test(form.city.value) && 
    emailRegExp.test(form.email.value);


    // Récupération des valeurs du formulaire
    const formulaireValues = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    };
    
    // Contrôler la validité du formulaire avant l'envoie dans le LS
    if(validForm == "" || validForm == undefined || validForm == false){
        alert("Veuillez remplir le formulaire correctement")

    } else if(orderLocalStorage == 0 || orderLocalStorage == null){
        alert ("Oupss...Votre panier est vide")

    } else {
        // Mettre formulaireValues dans le local storage
        alert("Vos informations ont bien été enregistrées")

        // Construire un array depuis le LS
        let idProduct = [];
        for(let pro = 0; pro < orderLocalStorage.length; pro++){
            idProduct.push(orderLocalStorage[pro].idProduct);
        }

        // Mettre les produits du panier ainsi que le formulaire dans un objet à envoyer vers l'API
        const order ={
            products : idProduct,
            contact :formulaireValues
        };
        console.log(order)

        // Envoie de l'objet infosToSend vers le serveur
        fetch("http://localhost:3000/api/products/order",{
            method: "POST",
            body : JSON.stringify(order),
            headers: {
                "Accept" : "Application/JSON",
                "Content-Type": "Application/JSON"},
            })
    
            .then(async(response) => response.json())     
            
            .then((data)=> {
                console.log(data)
                console.log(data.orderId);
                localStorage.setItem("orderId", data.orderId);
                window.location.href = "confirmation.html";
            })
            .catch((error)=>{
                console.error('Error du server: le problème sera réglé ultérieurement', error);
                alert("Un problème a été détecté au niveau du fetch, il sera réglé très prochainement !");
            })
           
    };
    
});

//--------------------Informations Formulaire statiques ------------------------------------------
// Prendre la key dans le localStorage et la mettre dans une variable
const dataLocalStorage = localStorage.getItem("formulaireValues");

// Convertir la chaine de caractère en objet javaScript
const dataLocalStorageObject = JSON.parse(dataLocalStorage);

// Mettre le contenu du localStorage dans les champs du formulaire
function fillUpForm(input){

    if(dataLocalStorageObject == null){
    } 
    else{
    document.querySelector(`#${input}`).value = dataLocalStorageObject[input];
    }
};

fillUpForm("firstName");
fillUpForm("lastName");
fillUpForm("address");
fillUpForm("city");
fillUpForm("email");
//----------------Informations Formulaire statiques ------FIN ------------------------------------


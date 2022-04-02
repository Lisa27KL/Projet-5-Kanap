let calculTotalQuantity = [];
let totalQuantity = document.getElementById("totalQuantity");

let calculTotalPrice = [];
let totalPrice =document.getElementById("totalPrice");

const reducer = (accumulator, currentValue) => accumulator + currentValue;

let orderLocalStorage = localStorage.getItem("infoCart") != null ? JSON.parse(localStorage.getItem("infoCart")) : null;

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

const firstName = document.getElementById("firstName");

function validationFirstName(){
    return namesRegExp.test(firstName.value);
};

firstName.addEventListener("change", function (e) {

    let errorMsg = firstName.nextElementSibling;
    validationFirstName(firstName) ? errorMsg.innerHTML ="Prénom Valide" :  errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Prénom correctement";
});

const lastName = document.getElementById("lastName");

function validationLastName(){
    return namesRegExp.test(lastName.value);
};

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

const address = document.getElementById("address")

function validationAddress(){
    return addressRegExp.test(address.value) 
};

address.addEventListener("change", function (e) {
    let errorMsg = address.nextElementSibling;
    validationAddress(address) ? errorMsg.innerHTML ='Adresse Valide' : errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Adresse";
});

const city = document.getElementById("city");

function validationCity(){
    return cityRegExp.test(city.value)
};

city.addEventListener("change", function(e) {
    validationCity(city);
    let errorMsg = city.nextElementSibling;

    if(validationCity(city)){
        errorMsg.innerHTML ="Ville Valide";
    
    }else{ 
        errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Ville";
    }
});

const email = document.getElementById("email");

function validationEmail (e){
    return emailRegExp.test(email.value);
};

email.addEventListener("change", function (){
    let errorMsg = email.nextElementSibling;
    validationEmail(email) ? errorMsg.innerHTML ="Email Valide" : errorMsg.innerHTML ="INVALIDE ~ Veuillez renseignez votre Email";
});


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
        alert("Vos informations ont bien été enregistrées")

        let idsProducts = [];
        for(let i = 0; i < orderLocalStorage.length; i++){
            idsProducts.push(orderLocalStorage[i].idProduct);
        }

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

        fetch("http://localhost:3000/api/products/order",{
            method: "POST",
            body : JSON.stringify(orderDetails),
            headers: {
                "Accept" : "Application/JSON",
                "Content-Type": "Application/JSON"},
            })
    
            .then((response) => response.json())     
            .then((data)=> {
            
                orderIdNumber = `${data.orderId}`;

                localStorage.clear();
                
                window.location.href = `./confirmation.html?id-order=${orderIdNumber}`;
            })
            .catch((error)=>{
                console.error('Error du server: le problème sera réglé ultérieurement', error);
                alert("Un problème a été détecté au niveau du fetch, il sera réglé très prochainement !");
            })
    };
});
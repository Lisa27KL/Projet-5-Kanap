// Récupérer que l'id du produit sélectionné
const product_url = window.location.search;
const urlSearchParams = new URLSearchParams(product_url);
const _id = urlSearchParams.get("id");


// Insérer produit et ses detailts avec API

fetch( `http://localhost:3000/api/products/${_id}`)
    .then((element) => {
        return element.json()})

    .then((element) => {

        //Titre de la page produit
        document.querySelector("title").innerHTML = `${element.name}`;

        //Nom du produit
        document.getElementById('title').innerHTML = `${element.name}`;

        //Description du produit
        document.getElementById('description').innerHTML = `${element.description}`;

        //Prix du produit
        document.getElementById('price').innerHTML =`${element.price}`;

        //Image du produit
        document
        .getElementsByClassName('item__img')[0]
        .insertAdjacentHTML ("afterbegin",`<img src=${element.imageUrl} alt=${element.altTxt}>`);

        //Options des couleurs du produit
        const select =document.getElementById('colors')
        
        element.colors.forEach((color) => {
            let theOption = document.createElement('option');
            theOption.value = color;
            theOption.innerHTML = `${color}`;
            select.appendChild(theOption);
        });

        //addBasket(element);
    })
    .catch((error) => {
        console.error('Error du server: le problème sera réglé ultérieurement', error)
    });



// Variables déclarées ici pour les appeler quand il le faut 
const color = document.getElementById("colors");
const quantity = document.getElementById("quantity");
let basketLists = [];



//Variable action -> popup de confirmation de démarche à suivre
const popupConfirmation = () =>{
    if(window.confirm(` L'article ${title.innerHTML} au prix de ${price.innerHTML} € a bien été ajouté au panier.
    OK pour consultez le panier, ANNULER pour continuer`)){
        window.location.href = "cart.html";
    }
};


const button = document.getElementById("addToCart")

    // Evenement-Ecouter lors du click du bouton pour ajouter au panier
    .addEventListener("click", (buttonEvent) =>{ 
        buttonEvent.preventDefault();
        

        // si les champs sont vides
        if(parseInt(quantity.value) === 0 || color.value ===""){
            return alert("Veuillez compléter chaque champ correctement s'il vous plaît ");
            
        } else  if (parseInt(quantity.value) >100){
            return alert("Choisissez une quantité entre 1 et 100");
            
        };

        const cartContent = localStorage.getItem("infoCart");

        const infoCart ={
            idProduct : _id,
            colorProduct : color.value,
            quantityProduct : parseInt(quantity.value),
        };

        // s'il n'y a pas de produit enregistré dans le localStorage :
        if(cartContent == null || cartContent == false ){
            basketLists.push(infoCart);
            localStorage.setItem ("infoCart",JSON.stringify(basketLists));
            popupConfirmation();     
            console.log("Je suis la 3")
            console.log(basketLists)
        }

    //-------------------------------------------------------------------------------------        
         // Verifier que la quantité totale de mon produit n'est ps >100

        else{
            // Récupérer le produit que l'on veut mettre dans le LS du LS (find)          
            let basket = JSON.parse(localStorage.getItem("infoCart"));
            const checkBasket = basket.find(p =>p.colorProduct === infoCart.colorProduct && p.idProduct === infoCart.idProduct);
            

            // s'il y a déjà le produit commandé dans le panier
            if(checkBasket >100) {
                checkBasket.quantityProduct += infoCart.quantityProduct
                alert("Choisissez une quantité entre 1 et 100");

            }
            else if(checkBasket != undefined){ 
                checkBasket.quantityProduct += infoCart.quantityProduct;
            
            }    
            else{
                basket.push(infoCart);
            };

            localStorage.setItem ("infoCart",JSON.stringify(basket));
            popupConfirmation();
          
        };
    });
;
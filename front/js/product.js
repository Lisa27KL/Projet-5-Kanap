// Récupérer que l'id du produit sélectionné
const product_url = window.location.search;
const urlSearchParams = new URLSearchParams(product_url);
const _id = urlSearchParams.get("id");
console.log(_id);


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


// Evenement-Ecouter lors du click du bouton pour ajouter au panier

const color = document.getElementById("colors");
const quantity = document.getElementById("quantity");
const price = document.getElementById("price")
const basket = localStorage.getItem("infoCart");
let basketLists = [];


//popup de confirmation de démarche à suivre
const popupConfirmation = () =>{
    if(window.confirm(` L'article ${title.innerHTML} au prix de ${price.innerHTML}€ a bien été ajouté au panier.
    OK pour consultez le panier, ANNULER pour continuer`)){
        window.location.href = "cart.html";
    }
} 

const button = document.getElementById("addToCart")
    .addEventListener("click", (buttonEvent) =>{ buttonEvent.preventDefault()
        const infoCart ={
            id : _id,
            color : color.value,
            quantity : parseInt(quantity.value),
            price : price.innerHTML,
        };
        console.log(infoCart)
        

      
        // s'il n'y a pas de produit enregistré dans le localStorage :
        if(basket == null){
            basketLists.push(infoCart);
            localStorage.setItem ("infoCart",JSON.stringify(basketLists));
        }

        //sinon s'il y a des produits enregistrés dans le localStorage :
        else if (basket!=null) {
            const checkBasket = basketLists.find((product) => product.id === infoCart.id && product.color === infoCart.color);

                // s'il y a déjà le produit commandé dans le panier
                if(checkBasket){
                    checkBasket.quantity += infoCart.quantity;
                    localStorage.setItem ("basketLists",JSON.stringify(basketLists));
                }
                // si le produit n'est pas déjà dans le panier
                else {
                    basketLists.push(infoCart);
                    localStorage.setItem ("basketLists",JSON.stringify(basketLists));

                }
             console.table(basketLists)
        };
        
        // si un champ est vide
        if(infoCart.color === "" || infoCart.quantity === 0) {
            alert("Veuillez remplir chaque champ correctement s'il vous plaît ");

        }
        // sinon confirmation que l'on peut aller au panier ou à l'accueil
        else{ 
            popupConfirmation();
        }
    
    });
;

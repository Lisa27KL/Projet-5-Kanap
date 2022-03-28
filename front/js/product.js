// Récupérer que l'id du produit sélectionné
const product_url = window.location.search;
const urlSearchParams = new URLSearchParams(product_url);
const _id = urlSearchParams.get("id");


// Insérer produit et ses detailts avec API

fetch( `http://localhost:3000/api/products/${_id}`)
    .then((response) => {
        return response.json()})

    .then((product) => {
        //Titre de la page produit
        document.querySelector("title").innerHTML = `${product.name}`;

        //Nom du produit
        document.getElementById('title').innerHTML = `${product.name}`;

        //Description du produit
        document.getElementById('description').innerHTML = `${product.description}`;

        //Prix du produit
        document.getElementById('price').innerHTML =`${product.price}`;

        //Image du produit
        document
        .getElementsByClassName('item__img')[0]
        .insertAdjacentHTML ("afterbegin",`<img src=${product.imageUrl} alt=${product.altTxt}>`);

        //Options des couleurs du produit
        const select =document.getElementById('colors')
        
        product.colors.forEach((color) => {
            let theOption = document.createElement('option');
            theOption.value = color;
            theOption.innerHTML = `${color}`;
            select.appendChild(theOption);
        });

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
        if(parseInt(quantity.value) === 0 && color.value ===""){
            return alert("Veuillez compléter chaque champ correctement s'il vous plaît ");
        }
        else if(color.value ===""){
            return alert("Veuillez choisir une couleur ");
            
        }else if (parseInt(quantity.value) < 1 || parseInt(quantity.value) > 100){
            return alert("Choisissez une quantité entre 1 et 100");
            
        };

        const cartContent = localStorage.getItem("infoCart");
       
        const infoCart ={
            idProduct : _id,
            colorProduct : color.value,
            quantityProduct : parseInt(quantity.value),
        };

        // s'il n'y a pas de produit enregistré dans le localStorage :
        if(cartContent == null){
            basketLists.push(infoCart);
            localStorage.setItem ("infoCart",JSON.stringify(basketLists));
            popupConfirmation();     
        }
    //-------------------------------------------------------------------------------------      
        // Sinon le LS contient des produits :
        else{
            // Récupérer le produit que l'on veut mettre dans le LS du LS (find)          
            let basket = JSON.parse(localStorage.getItem("infoCart"));
            const checkBasket = basket.find(p => p.colorProduct === infoCart.colorProduct && p.idProduct === infoCart.idProduct);
            

            if(checkBasket != undefined){ 
                checkBasket.quantityProduct += infoCart.quantityProduct;

                // Si la quantité de produit + quantité du Local Storage >100
                let localQuantity = infoCart.quantityProduct;
                console.log(localQuantity);
                let addQuantity = checkBasket.quantityProduct;
                console.log(addQuantity);
                let maxQuantity = parseInt(addQuantity) + parseInt(localQuantity);
                console.log(maxQuantity)
                if(maxQuantity > 100){
                    console.log(maxQuantity > 100)
                    return alert ("Attention, vous avez plus de 100 articles dans votre panier")
                };
            }
            else{
                basket.push(infoCart);
            };    

            localStorage.setItem ("infoCart",JSON.stringify(basket));
            popupConfirmation();
          
        };
    });
;
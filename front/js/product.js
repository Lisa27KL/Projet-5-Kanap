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



// Le LocalStorage
const local = JSON.parse(localStorage.getItem("infocart"));

// Evenement-Ecouter lors du click du bouton pour ajouter au panier

const button = document.getElementById("addToCart")
    .addEventListener("click", (buttonEvent) =>{ buttonEvent.preventDefault();
        const infocart ={
            title : title.value,
            colors : colors.value,
            quantity : quantity.value,
        }

    localStorage.setItem ("infoCart",JSON.stringify(infocart) );
    console.log(button)
});



if(local != null){
    title.textContent = `${local.title}, ${local.colors}, ${local.quantity}`;
}




/*const addToBasket = () =>{
 

    button.addEventListener("click",() => {
        let arrayProducts = JSON.parse
        let select = document.getElementById("colors")
        console.log(select)
    })
}*/

/*const addToBasket = ((inTheBasket) => {

    let nameValue = document.getElementById("name");
    nameValue.value = name;
    localStorage.setItem("name");

    let colorsValue = document.getElementById("colors");
    colorsValue.value = colors;
    localStorage.setItem("colors");

    let quantityValue = document.getElementById("quantity");
    quantityValue.value = quantity;
    localStorage.setItem("quantity");
})
console.log(addToBasket)*/


// localStorage.setItem("clé", "valeur")
// localeStorage.getItem("clé")
// localeStorage.clear();


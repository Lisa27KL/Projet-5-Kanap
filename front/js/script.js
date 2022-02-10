//Afficher les articles à partir de l'API
fetch('http://localhost:3000/api/products')
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        const items = document.getElementById("items");
        data.forEach(element => {
            items.innerHTML += 
            `<a href ="./product.html?id=${element._id}"> 
                <article>
                    <img src=${element.imageUrl} ${element.altTxt}> 
                    <h3> ${element.name}</h3> 
                    <p> ${element.description} </p> 
                </article> 
            </a> `;
        
        })
    })
    .catch((error) => {
        console.error('Error du server: le problème sera réglé ultérieurement', error);
    });


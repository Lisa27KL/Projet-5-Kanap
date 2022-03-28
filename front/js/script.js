//Afficher les articles à partir de l'API
fetch('http://localhost:3000/api/products')
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        const items = document.getElementById("items");
        data.forEach(item => {
            items.innerHTML += 
            `<a href ="./product.html?id=${item._id}"> 
                <article>
                    <img src=${item.imageUrl} ${item.altTxt}> 
                    <h3> ${item.name}</h3> 
                    <p> ${item.description} </p> 
                </article> 
            </a> `;
        })
    })
    .catch((error) => {
        console.error('Error du server: le problème sera réglé ultérieurement', error);
    });


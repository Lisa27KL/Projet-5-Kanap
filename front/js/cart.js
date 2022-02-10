const local = JSON.parse(localStorage.getItem("infocart"));

if(local!= null){
    title.textContent = `${local.title}, ${local.colors}, ${local.quantity}`;
}
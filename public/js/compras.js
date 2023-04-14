const salir = document.querySelector("#salir");
const productos = document.querySelector("#productos");
const date = document.querySelector(".date");

date.innerHTML = `${new Date().getDate()} - ${
  new Date().getMonth() + 1
} - ${new Date().getFullYear()}`;

salir.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = "index.html";
});

productos.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = "products.html";
});

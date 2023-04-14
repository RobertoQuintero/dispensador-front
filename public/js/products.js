const grid = document.querySelector(".products-grid");
const modal = document.querySelector(".modal");
const aceptar = document.querySelector("#aceptar");
const salir = document.querySelector("#salir");
const compras = document.querySelector("#compras");
const date = document.querySelector(".date");

date.innerHTML = `${new Date().getDate()} - ${
  new Date().getMonth() + 1
} - ${new Date().getFullYear()}`;
let data = [];

//Construcion del DOM
const dibujarProducto = (producto) => {
  const { id, name, img, price, quantity } = producto;

  return `
  <div id="${id}" class="products-grid__item card">
    <span class="products-grid__item-price">${
      quantity ? `$${price}` : "Agotado"
    }</span>
    <div class="products-grid__item-img"
        style="
        background: url(${img});
        background-size: cover;
      "></div>
    <div class="products-grid__item-description">
      <p class="products-grid__item-name">${name}</p>
      <p class="products-grid__item-exist">Quedan: ${quantity}</p>
    </div>
  </div>
  `;
};

const dibujarModal = (product) => {
  const { name, price, img, quantity, id } = product;
  modal.innerHTML = `
    <div class='modal-background'>
      <div class='modal-confirmation'>
      <div class='modal-confirmation__description'>
          <p class='modal-confirmation__title'>
            ${quantity ? "Confirme su compra" : "Producto agotado"}
          </p>
          <div class='modal-confirmation__img'
                style="
                background: url(${img});
                background-size: cover;
                background-position: center;
                "
          ></div>
          <p class='modal-confirmation__name'>${name}</p>
          <p class='modal-confirmation__price'>$${price}</p>
        </div>
        <div class='modal-confirmation__buttons'>
        <button id='aceptar' class='button morado' ${!quantity && `disabled`}>
          Aceptar
        </button>
        <button class='modal-button button cancelar'>
          Cancelar
        </button>
        </div>
      </div>
    </div>
  `;
};

//Listeners

grid.addEventListener("click", (e) => {
  e.preventDefault();
  const id =
    e.target.getAttribute("id") ||
    e.target.parentNode.getAttribute("id") ||
    e.target.parentNode.parentNode.getAttribute("id");

  const product = data.filter((product) => id === product.id)[0];
  if (!product) return;
  dibujarModal(product);
});

modal.addEventListener("click", (e) => {
  e.preventDefault();
  const element = e.target;
  if (
    element.classList.contains("modal-background") ||
    element.classList.contains("modal-button")
  ) {
    modal.innerHTML = "";
  }
  if (element.getAttribute("id") === "aceptar") {
    setTimeout(() => {
      element.disabled = false;
      console.log("realiza compra");
      modal.innerHTML = "";
    }, 1000);
    element.disabled = true;
  }
});

salir.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = "/";
});

compras.addEventListener("click", (e) => {
  window.location = "compras.html";
});

const dibujaGrid = (data) => {
  let htmlElement = "";
  data.forEach((element) => {
    htmlElement += dibujarProducto(element);
  });
  grid.innerHTML = htmlElement;
};

const getProducts = async () => {
  const resp = await (
    await fetch("http://localhost:8080/api/productos")
  ).json();

  return resp;
};

const main = async () => {
  data = await getProducts();
  dibujaGrid(data);
};

main();

const grid = document.querySelector(".products-grid");
const modal = document.querySelector(".modal");
const aceptar = document.querySelector("#aceptar");
const salir = document.querySelector("#salir");
const compras = document.querySelector("#compras");
const date = document.querySelector(".date");

date.innerHTML = `${new Date().getDate()} - ${
  new Date().getMonth() + 1
} - ${new Date().getFullYear()}`;
const data = [
  {
    id: "1",
    nombre: "Libreta de rayas 100 hojas",
    precio: 50,
    existencia: 5,
    img: "https://cdn10.totalcode.net/normamx/product-image/es/cuaderno-argollado-profesional-cuadro-chico-norma-azul-100-hojas-1.webp",
  },
  {
    id: "2",
    nombre: "Lapicero bic color negro x 3",
    precio: 20,
    existencia: 10,
    img: "https://e4d4ed17ba.cbaul-cdnwnd.com/b03aca64114da88668ea2588c9613b77/200000010-a2f6ea3ec5/lapice.JPG?ph=e4d4ed17ba",
  },
  {
    id: "3",
    nombre: "Cinta Bic Correctora Wocc-6 Caja C/6",
    precio: 249,
    existencia: 0,
    img: "https://http2.mlstatic.com/D_NQ_NP_736534-MLM45729934556_042021-O.webp",
  },
];

//Construcion del DOM
const dibujarProducto = (producto) => {
  const { id, nombre, img, precio, existencia } = producto;

  return `
  <div id="${id}" class="products-grid__item card">
    <span class="products-grid__item-price">${
      existencia ? `$${precio}` : "Agotado"
    }</span>
    <div class="products-grid__item-img"
        style="
        background: url(${img});
        background-size: cover;
      "></div>
    <div class="products-grid__item-description">
      <p class="products-grid__item-name">${nombre}</p>
      <p class="products-grid__item-exist">Quedan: ${existencia}</p>
    </div>
  </div>
  `;
};

const dibujarModal = (product) => {
  const { nombre, precio, img, existencia, id } = product;
  modal.innerHTML = `
    <div class='modal-background'>
      <div class='modal-confirmation'>
      <div class='modal-confirmation__description'>
          <p class='modal-confirmation__title'>
            ${existencia ? "Confirme su compra" : "Producto agotado"}
          </p>
          <div class='modal-confirmation__img'
                style="
                background: url(${img});
                background-size: cover;
                background-position: center;
                "
          ></div>
          <p class='modal-confirmation__name'>${nombre}</p>
          <p class='modal-confirmation__price'>$${precio}</p>
        </div>
        <div class='modal-confirmation__buttons'>
        <button id='aceptar' class='button morado' ${!existencia && `disabled`}>
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
  if (!data[id - 1]) return;
  dibujarModal(data[id - 1]);
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
  window.location = "index.html";
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

const main = () => {
  dibujaGrid(data);
};

main();

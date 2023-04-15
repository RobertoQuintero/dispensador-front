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
        background-size: contain;
        background-position: center;
        background-repeat:no-repeat;
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
                background-size: contain;
                background-position: center; 
                background-repeat:no-repeat;
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
  localStorage.setItem("product", JSON.stringify(product));
  dibujarModal(product);
});

modal.addEventListener("click", async (e) => {
  e.preventDefault();
  const element = e.target;
  if (
    element.classList.contains("modal-background") ||
    element.classList.contains("modal-button")
  ) {
    modal.innerHTML = "";
  }
  if (element.getAttribute("id") === "aceptar") {
    element.disabled = true;
    const user = JSON.parse(localStorage.getItem("user"));
    const product = JSON.parse(localStorage.getItem("product"));
    const purchase = {
      user: user.uid,
      product: product.id,
      quantity: 1,
      total: product.price,
    };

    const resp = await (
      await fetch("http://localhost:8080/api/compras", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(purchase),
      })
    ).json();

    if (!resp.ok) {
      alert("Error al ejecutar la compra");
    } else {
      console.log(resp.purchase);
      const purchase = {
        name: product.name,
        total: product.price,
        quantity: 1,
        createdAt: resp.purchase.createdAt,
      };
      const purchases = JSON.parse(localStorage.getItem("compras"));
      purchases.unshift(purchase);
      localStorage.setItem("compras", JSON.stringify(purchases));
    }
    modal.innerHTML = "";
    console.log(resp);
  }
});

salir.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  localStorage.removeItem("products");
  localStorage.removeItem("product");
  localStorage.removeItem("compras");
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
  console.log("getproducts");
  const resp = await (
    await fetch("http://localhost:8080/api/productos")
  ).json();
  localStorage.setItem("products", JSON.stringify(resp));
  return resp;
};

const main = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const products = JSON.parse(localStorage.getItem("products"));
  if (!user) window.location = "index.html";
  if (!products) {
    data = await getProducts();
    dibujaGrid(data);
  } else {
    data = products;
    dibujaGrid(data);
  }

  const ctrlnum = document.querySelector("#ctrlnum");
  const name = document.querySelector("#name");
  const credit = document.querySelector("#credit");

  ctrlnum.innerHTML = user.ctrlnum;
  name.innerHTML = user.name;
  credit.innerHTML = `$${user.credit}`;
};

main();

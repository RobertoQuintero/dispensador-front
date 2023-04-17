const grid = document.querySelector(".products-grid");
const modal = document.querySelector(".modal");
const aceptar = document.querySelector("#aceptar");
const salir = document.querySelector("#salir");
const compras = document.querySelector("#compras");

const ctrlnum = document.querySelector("#ctrlnum");
const name = document.querySelector("#name");
const credit = document.querySelector("#credit");

const socket = io();

const date = document.querySelector(".date");

const today = new Date(new Date());

date.innerHTML = `${today.getDate()} - ${
  today.getMonth() + 1
} - ${today.getFullYear()}`;

//local storage
const getLocalStorage = () => {
  return {
    products: JSON.parse(localStorage.getItem("products")),
    user: JSON.parse(localStorage.getItem("user")),
    product: JSON.parse(localStorage.getItem("product")),
    purchases: JSON.parse(localStorage.getItem("compras")),
  };
};

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
  const { products, user } = getLocalStorage();
  const id =
    e.target.getAttribute("id") ||
    e.target.parentNode.getAttribute("id") ||
    e.target.parentNode.parentNode.getAttribute("id");

  const product = products.filter((product) => id === product.id)[0];
  if (!product) return;
  if (user.credit < product.price) return alert("Crédito insuficiente");
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
    await procesaCompra();
    modal.innerHTML = "";
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

//peticiones a base de datos

const procesaCompra = async () => {
  const { products, user, product, purchases } = getLocalStorage();

  const [respCompra, respUsuario, respProducto] = await Promise.all([
    realizaCompra(user, product),
    actualizaUsuario(user, product),
    actualizarProducto(product),
  ]);

  if (!respCompra.ok || !respUsuario.ok || !respProducto.ok) {
    alert("Error al ejecutar la compra");
  } else {
    socket.emit("mover-motor", "llama función para hacer mover motor");
    //actualiza compra en el storage
    alert("Compra exitosa");
    const purchaseLocal = {
      name: product.name,
      total: product.price,
      quantity: 1,
      createdAt: respCompra.purchase.createdAt,
    };
    if (purchases) {
      purchases.unshift(purchaseLocal);
      localStorage.setItem("compras", JSON.stringify(purchases));
    }

    //actuliza usuario en el storage
    user.credit = respUsuario.usuario.credit;
    user.counter = respUsuario.usuario.counter;
    localStorage.setItem("user", JSON.stringify(user));
    credit.innerHTML = `$${user.credit}`;

    //actualiza cantidad de producto
    const newProducts = products.map((p) => {
      if (p.id === product.id) {
        p.quantity = p.quantity - 1;
        return p;
      }
      return p;
    });
    localStorage.setItem("products", JSON.stringify(newProducts));
    dibujaGrid(newProducts);
  }
};

const realizaCompra = async (user, product) => {
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
  return resp;
};

const actualizaUsuario = async (user, product) => {
  const newUser = {
    credit: user.credit - product.price,
    counter: user.counter + 1,
  };

  const resp = await (
    await fetch(`http://localhost:8080/api/usuarios/${user.uid}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(newUser),
    })
  ).json();
  return resp;
};

const actualizarProducto = async (product) => {
  const newQuantity = {
    quantity: product.quantity - 1,
  };

  const resp = await (
    await fetch(`http://localhost:8080/api/productos/${product.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(newQuantity),
    })
  ).json();
  return resp;
};

const getProducts = async () => {
  const resp = await (
    await fetch("http://localhost:8080/api/productos")
  ).json();
  localStorage.setItem("products", JSON.stringify(resp));
  return resp;
};

const conectarSocket = () => {
  // socket.on("connect", () => {
  //   console.log("conectado");
  // });

  socket.on("disconnect", () => {
    console.log("desconectado");
  });

  socket.on("movio-motor", (msg) => {
    console.log("movió-motor: " + msg);
  });
};

const main = async () => {
  conectarSocket();
  const { products, user } = getLocalStorage();

  ctrlnum.innerHTML = user.ctrlnum;
  name.innerHTML = user.name;
  credit.innerHTML = `$${user.credit}`;

  if (!user) window.location = "index.html";
  if (!products) {
    data = await getProducts();
    dibujaGrid(data);
  } else {
    data = products;
    dibujaGrid(data);
  }
};

main();

const salir = document.querySelector("#salir");
const productos = document.querySelector("#productos");
const date = document.querySelector(".date");
const container = document.querySelector(".sales-container");

//html elements
const ctrlnum = document.querySelector("#ctrlnum");
const name = document.querySelector("#name");
const credit = document.querySelector("#credit");

const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location = "index.html";

date.innerHTML = `${new Date().getDate()} - ${
  new Date().getMonth() + 1
} - ${new Date().getFullYear()}`;

const dibujarCompra = (product) => {
  const { name, total, createdAt } = product;
  const date = new Date(createdAt);

  return `
  <div class="sales-item">
    <p class="sales-item__name">${name}</p>
    <p class="sales-item__price">$${total}</p>
    <p class="sales-item__date">${date.getDay()} - ${
    date.getMonth() + 1
  } - ${date.getFullYear()}</p>
  </div>
  `;
};

const dibujaLista = (data) => {
  console.log(data);
  let htmlElement = "";
  if (data.length !== 0) {
    data.forEach((element) => {
      htmlElement += dibujarCompra(element);
    });
  } else {
    htmlElement = `
    <h3 class='no-purchases'>No has realizado ninguna compra 😕</h3>
    `;
  }
  container.innerHTML = htmlElement;
};

const getPurchases = async () => {
  console.log("getpurchases");
  const resp = await (
    await fetch(`http://localhost:8080/api/compras/${user.uid}`)
  ).json();
  if (!resp.ok) {
    console.log(resp.msg);
    return;
  } else {
    localStorage.setItem("compras", JSON.stringify(resp.purchases));
    return resp.purchases;
  }
};

const main = async () => {
  const purchases = JSON.parse(localStorage.getItem("compras"));
  if (!purchases) {
    const resp = await getPurchases();
    dibujaLista(resp);
  } else {
    dibujaLista(purchases);
  }

  ctrlnum.innerHTML = user.ctrlnum;
  name.innerHTML = user.name;
  credit.innerHTML = `$${user.credit}`;
};

//listeners

salir.addEventListener("click", (e) => {
  localStorage.removeItem("compras");
  localStorage.removeItem("user");
  localStorage.removeItem("product");
  localStorage.removeItem("products");
  window.location = "index.html";
});

productos.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = "products.html";
});

main();

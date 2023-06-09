const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const text = document.querySelector("#text");
// const baseUrl='http://localhost:8080/api/usuarios'
// const baseUrl = "https://dispensador-front-production.up.railway.app";
const baseUrl = "http://localhost:8080";

const id = urlParams.get("id");

const getUser = async () => {
  try {
    const resp = await (await fetch(`${baseUrl}/api/usuarios/${id}`)).json();
    const { ok, msg, user } = resp;

    if (ok) {
      window.location = "products.html";
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      text.innerHTML = msg;

      setTimeout(() => {
        window.location = "index.html";
      }, 1000);
    }
  } catch (error) {
    text.innerHTML = "error inesperado";
    window.location = "index.html";
  }
};

const main = async () => {
  await getUser();
};
main();

const form = document.querySelector(".login-register__form");
const container = document.querySelector(".full-container");
const html5QrCode = new Html5Qrcode(/* element id */ "reader");
const salir = document.querySelector("#salir-login");
// const baseUrl = "https://dispensador-front-production.up.railway.app";
const baseUrl = "http://localhost:8080";
const removeLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("product");
  localStorage.removeItem("products");
  localStorage.removeItem("compras");
};

const goBack = () => {
  salir.style.display = "none";
  html5QrCode.stop();
  window.location = "index.html";
};

form.addEventListener("submit", (e) => {
  setTimeout(() => {
    goBack();
  }, 15000);
  e.preventDefault();
  container.remove();
  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices && devices.length) {
        var cameraId = devices[0].id;

        html5QrCode
          .start(
            cameraId,
            {
              fps: 5, // Optional, frame per seconds for qr code scanning
              qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
            },
            (result) => {
              salir.style.display = "none";
              html5QrCode.stop();
              console.log(result.split("0/")[1]);
              window.location = `${baseUrl}/${result.split("0/")[1]}`;
            },
            (errorMessage) => {
              console.log(errorMessage);
            }
          )
          .catch((err) => {});
      }
    })
    .catch((err) => {
      // handle err
    });
  salir.style.display = "block";
});

salir.addEventListener("click", (e) => {
  goBack();
});

const main = () => {
  removeLocalStorage();
};

main();

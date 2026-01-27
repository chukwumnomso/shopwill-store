import "./style.css";

const all = document.getElementById("all");
const pants = document.getElementById("pants");
const shirt = document.getElementById("shirt");
const hoodie = document.getElementById("hoodie");

const container = document.getElementById("container");

const active = "bg-red-500";
const products = [
  { name: "hoodie", price: 20 },
  { name: "shirt", price: 40 },
  { name: "pants", price: 50 },
];

const p = products;
function showall() {
  products.forEach((pro) => {
    const allprod = document.createElement("div");
    allprod.innerHTML = `<p>${pro.name}</p>
        <p>${pro.price}</p>`;
    container.appendChild(allprod);
  });
  all.classList.add(active);
}

document.addEventListener("DOMContentLoaded", showall);

all.addEventListener("click", () => {
  products.forEach((pro) => {
    const allprod = document.createElement("div");
    allprod.innerHTML = `<p>${pro.name}</p>
        <p>${pro.price}</p>`;
    container.appendChild(allprod);
  });

  all.classList.add(active);
  change(shirt, pants, hoodie);
});

hoodie.addEventListener("click", () => {
  container.innerHTML = `<p>${p[0].name}</p>
        <p>${p[0].price}</p>`;
  hoodie.classList.add(active);
  change(shirt, pants, all);
});

shirt.addEventListener("click", () => {
  container.innerHTML = `<p>${p[1].name}</p>
        <p>${p[1].price}</p>`;
  shirt.classList.add(active);
  change(hoodie, pants, all);
});
pants.addEventListener("click", () => {
  container.innerHTML = `<p>${p[2].name}</p>
        <p>${p[2].price}</p>`;
  pants.classList.add(active);
  change(hoodie, shirt, all);
});

function change(...args) {
  args.forEach((btn) => {
    btn.classList.remove(active);
  });
}

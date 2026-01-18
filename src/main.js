import "./style.css";

const product = {
  name: "Sample Product",
  price: 29.99,
  productImage: "/src/assets/sample.jpeg",
  productId: "001",
};

function addProductToDOM() {
  const productContainer = document.getElementById("product-lists");

  const productCard = document.createElement("div");
  productCard.className =
    "bg-white shadow-md  border border-gray-200 rounded-lg p-4  lg:h-100";
  productCard.innerHTML = `
<img src="${product.productImage}" alt="${
    product.name
  }" class="w-full h-50 object-cover mb-2 lg:h-60 md:h-60"/>
<h2 class="text-sm font-semibold mb-2">${product.name}</h2>
  <p class="text-sm font-semibold text-blue-600">$${product.price.toFixed(
    2,
  )}</p>
  <button class="mt-4 bg-black text-white text-xs px-4 py-2 rounded w-full hover:bg-white hover:text-black">Add to Cart</button>
  <button class="mt-2 bg-green-500 text-white text-xs px-4 py-2 rounded w-full hover:bg-green-600">Delete</button>
`;
  return productContainer.appendChild(productCard);
}

const addBtn = document.getElementById("add-product");

addBtn.addEventListener("click", () => {
  addProductToDOM();
});

const shopImg = document.getElementById("shop");
shopImg.src = product.productImage;

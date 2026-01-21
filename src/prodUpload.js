import {
  AuthInvalidCredentialsError,
  createClient,
} from "@supabase/supabase-js";
const supabaseUrl = "https://jyftjplwefbyzhaoprgb.supabase.co";
const supabaseKey = "sb_publishable_UBJCM7-3VAcTquVoWS3bog_c2uqtM2H";
export const supabase = createClient(supabaseUrl, supabaseKey);
// END OF SUPABASE INITILIZATION

import { prodName } from "./main";
import { price } from "./main";
import { prodId } from "./main";
// import { productImg } from "./main";
// import { showcase } from "./main";
// import { prodList } from "./main";

// console.log(prodList);

const productImg = document.getElementById("product-img");

productImg.addEventListener("change", (e) => {
  if (e.target.files.length === 0) {
    console.log("No file selected!");
  }

  const file = e.target.files[0];
  uploadproduct(file);
  // loadImage();
  console.log(file);
});

export async function uploadproduct(file) {
  const avatar = "avatar";
  const filePath = `productImage/${Date.now()}-${avatar}`;
  const { data, error } = await supabase.storage
    .from("productImage")
    .upload(filePath, file);

  prodName();
  price();
  prodId();
  try {
    const { data: insertData } = await supabase
      .from("products")
      .insert([
        {
          product_name: prodName(),
          product_price: price(),
          product_image: filePath,
          product_id: prodId(),
        },
      ])
      .select()
      .single();
  } catch {}
}

const prodList = document.getElementById("product-lists");

export async function renderProduct() {
  prodList.innerHTML = "";
  const { data: cards } = await supabase.from("products").select("*");

  cards.forEach((card) => {
    const { data: urlData } = supabase.storage
      .from("productImage")
      .getPublicUrl(card.product_image);
    const prodImage = urlData.publicUrl;

    const prodcard = document.createElement("div");
    prodcard.innerHTML = `<div
        class="bg-white shadow-md shadow-gray-400 rounded-xl py-4 px-4 capitalize relative "
      >
<div class=" items-center justify-center text-sm font-[outfit] text-white bg-red-600 mt-3 absolute top-0 left-0  h-5 w-15 hidden"
      >sold</div>
        <img src="${prodImage}" class=" hover:scale-101 transition duration-300 overflow-hidden" />
         <div class="flex justify-between items-center "><h2 class="font-bold font-[outfit] text-sm mb-2 mt-2">${card.product_name}</h2><div
      class="size-6 bg-purple-600 flex justify-center items-center rounded-full hover:bg-purple-700 cursor-pointer"
    >  <i class="fa-solid fa-bag-shopping text-sm text-white font-light"></i></div></div>
        
        <p class="text-[0.8rem] text-black font-semibold">₦${card.product_price}</p>
         <p class="text-[0.7rem] text-pink-500 hidden">${card.product_id}</p>
         <button class="w-full h-8 bg-black text-white font-semibold flex items-center justify-center rounded-lg mt-2 hover:bg-gray-800 cursor-pointer">view</button>
      </div>`;

    prodList.appendChild(prodcard);
  });
}

renderProduct();

// const prodcard = document.createElement("div");
// prodcard.innerHTML = `<div
//         class="bg-white shadow-md shadow-gray-400 rounded-xl py-4 px-4 capitalize"
//       >

//         <img src="${prodImage}" />
//         <h2 class="font-bold font-[outfit] text-sm mb-2 mt-2">${prodName()}</h2>
//         <p class="text-[0.7rem] text-pink-500">${price()}</p>
//          <p class="text-[0.7rem] text-pink-500">${prodId()}</p>
//       </div>`;
// const prodList = document.getElementById("product-lists");

// prodList.appendChild(prodcard);

// document.addEventListener("DOMContentLoaded", uploadproduct);
// export async function loadImage() {
//   prodId();
//   const { data: imgUrl } = await supabase
//     .from("products")
//     .select("product_image")
//     .eq("product_id", prodId())
//     .single();
//   const showProduct = imgUrl[0].product_image;
//   if (showProduct) {
//     const { data } = await supabase.storage
//       .from("productImage")
//       .getPublicUrl(showProduct);
//     const prodImage = data.publicUrl;
//     console.log(prodImage);
//     return prodImage;
//   }
// }

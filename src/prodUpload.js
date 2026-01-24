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

// END OF IMPORTS

// PRODUCT RENDERING

const productImg = document.getElementById("product-img");

productImg.addEventListener("change", (e) => {
  if (e.target.files.length === 0) {
    console.log("No file selected!");
  }

  const file = e.target.files[0];
  uploadproduct(file);
  console.log(file);
});

export async function uploadproduct(file) {
  const avatar = "avatar";
  const filePath = `productImage/${Date.now()}-${avatar}`;
  const { data, error } = await supabase.storage
    .from("productImage")
    .upload(filePath, file, { cacheControl: "3600", upsersert: true });

  prodName();
  price();
  prodId();
  try {
    const { data: insertData } = await supabase
      .from("products")
      .upsert({
        product_name: prodName(),
        product_price: price(),
        product_image: filePath,
        id: prodId(),
      })
      .select()
      .single();
  } catch {}
}

export let currentPage = 0; // 0-based index for Supabase range
const pageSize = 6; // Items per page

export async function renderProduct(page) {
  const prodList = document.getElementById("product-lists");
  const controls = document.getElementById("pagination-controls");
  prodList.innerHTML = "";
  // Calculate start and end indices
  const from = page * pageSize;
  const to = from + pageSize - 1;
  // Fetch data + total row count
  const {
    data: cards,
    count,
    error,
  } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    // 'exact' returns total rows matching filter
    .range(from, to)
    .order("id", { ascending: true }); // Ordering prevents unexpected range behavior
  cards.forEach((card) => {
    const { data: urlData } = supabase.storage
      .from("productImage")
      .getPublicUrl(card.product_image);
    const prodImage = urlData.publicUrl;

    const prodcard = document.createElement("div");
    prodcard.innerHTML = `<div
        class="rounded-xl  capitalize relative h-80 grid grid-rows-2 sm:h-100  "
      >
<div class=" items-center justify-center text-sm font-[outfit] text-white bg-red-600 mt-3 absolute top-0 left-0  h-5 w-15 text-center z-10 sold " 
      >sold</div>
       <div class=" flex items-center justify-center overflow-hidden row-span-3 "> <img src="${prodImage}" class=" hover:scale-103 transition-all h-full w-full duration-300 overflow-hidden" /></div>

        <div class="flex-col items-center justify-center"> <div class="flex justify-between items-center px-10 lg:px-15"><h2 class="font-normal font-[playfair] text-sm mb-2 mt-2 lg:text-lg">${card.product_name}</h2><div
      class="size-6 bg-purple-600 flex justify-center items-center rounded-full hover:bg-purple-700 cursor-pointer"
    >  <i class="fa-solid fa-bag-shopping text-sm text-white font-light"></i></div></div>
        
    <div class= "w-full text-center border "><p class="text-[0.8rem] text-black font-semibold">₦${card.product_price}</p></div>    
         <p class="text-[0.7rem] text-pink-500  font-bold hidden">${card.id}</p>
        
      </div></div>
        `;

    prodList.appendChild(prodcard);
    return prodcard;
  });

  // 2. Display Pagination Buttons
  const totalPages = Math.ceil(count / pageSize);
  controls.innerHTML = "";

  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i + 1;

    const baseStyles =
      "px-4 py-2 border rounded-md transition-colors cursor-pointer ";
    const activeStyles = "bg-pink-600 text-white border-pink-600";
    const inactiveStyles =
      "bg-white text-gray-700 hover:bg-gray-100 border-gray-300";
    btn.className = baseStyles + (i === page ? activeStyles : inactiveStyles);
    btn.onclick = () => {
      currentPage = i;
      prodList.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      console.log(currentPage);
      renderProduct(currentPage)
        .then((get) => {
          const solds = document.querySelectorAll(".sold");
          solds.forEach((sold) => {
            sold.classList.add("hidden");
          });
        })
        .catch((error) => console.error(error));
    };
    controls.appendChild(btn);
  }
}

renderProduct(currentPage)
  .then((get) => {
    const solds = document.querySelectorAll(".sold");
    solds.forEach((sold) => {
      sold.classList.add("hidden");
    });
  })
  .catch((error) => console.error(error));

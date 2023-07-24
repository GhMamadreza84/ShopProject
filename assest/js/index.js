const showModalBtn = document.querySelector(".show-modal");
const backDrop = document.querySelector(".back-drop");
const confirmModal = document.querySelector(".confirm-modal");
const modal = document.querySelector(".modal");
const clearCart = document.querySelector(".clear-cart");
const productDOM = document.querySelector(".games-center");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".price");
const cartContent = document.querySelector(".cart-content");
import { productData } from "./product.js";

let cart = [];
let buttonDOM = [];
//1.get product
class Product {
  getproduct() {
    return productData;
  }
}

//2.display products
class UI {
  displayProduct(product) {
    let result = "";
    product.forEach((item) => {
      result += `
      <div class="text-center m-9 shadow-2xl  w-[250px] h-auto flex flex-col justify-around rounded-b-xl rounded-t-xl -skew-y-6 hover:-skew-y-0  hover:-translate-y-6 duration-500 cursor-pointer">
        <div>
          <img src="../assest/images/R6.jpg" alt="" class=" rounded-t-xl w-full h-full" />
        </div>
        <div class="flex flex-col justify-between m-4">
          <a href="" class="text-[#313131]  dark:hover:text-[#2948C5] hover:text-[#2948C5] dark:text-white transition-all">${item.title}</a>
          
        </div>
        <div class="text-[#313131] dark:text-white">تومان ${item.price}</div>
        
        <div>
          <button
            type="button" data-id=${item.id}
            class="btn btn-default  add-to-cart shadow-lg bg-[#2F58FC] w-full h-10 rounded text-lg text-white inline-block font-semibold"
          >
            
            خرید
          </button>
        </div>
      </div>
      
    `;
      productDOM.innerHTML = result;
    });
  }
  getAddToCartBtn() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonDOM = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === id);
      if (isInCart) {
        btn.innerText = "در سبد خرید";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "در سبد خرید";
        event.target.disabled = true;
        //get product from products :
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        //add to cart
        cart = [...cart, addedProduct];
        //save cart to local storage
        Storage.saveCart(cart);
        //update cart value
        this.setCartValue(cart);
        //add to cart item
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItem = 0;
    let totalPrice = cart.reduce((acc, curr) => {
      tempCartItem += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `قیمت کل: ${totalPrice.toFixed(2)} تومان`;
    cartItems.innerText = tempCartItem;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add(
      "cart-item",
      "w-full",
      "flex",
      "justify-between",
      "dark:bg-white",
      "mt-2"
    );
    div.innerHTML = `
          <div>
            <img
              src=${cartItem.imageUrl}
              alt="R6"
              class="w-[120px] h-[72px] rounded-md "
            />
          </div>
          <div class="flex flex-col justify-between w-[150px]">
            <h3 class="">${cartItem.title}</h3>
            <p class="text-slate-600">${cartItem.price} تومان</p>
          </div>
          <div class="flex flex-col items-center justify-center ">
            <i class="fa fa-chevron-up text-[#2948C5] cursor-pointer" data-id=${cartItem.id}></i>
            <p>${cartItem.quantity}</p>
            <i class="fa fa-chevron-down text-red-700 cursor-pointer" data-id=${cartItem.id}></i>
          </div>
          <i class="fa fa-trash text-[#2948C5] cursor-pointer mt-[27px] mr-[5px]" data-id=${cartItem.id}></i>
    `;
    cartContent.appendChild(div);
  }
  setUpApp() {
    //get cart from storage
    cart = Storage.getCart() || [];
    //addCartitem
    cart.forEach((Item) => this.addCartItem(Item));
    //set value : price + items
    this.setCartValue(cart);
  }
  cartLogic() {
    clearCart.addEventListener("click", () => this.clearCart());
    // cart functionaly
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-chevron-up")) {
        // console.log(event.target.dataset.id);
        const addQuantity = event.target;
        //1.get item from cart
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;
        //2.update cart value
        this.setCartValue(cart);
        //3.save cart
        Storage.saveCart(cart);
        //4.update cart item in UI
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      }
      if (event.target.classList.contains("fa-chevron-down")) {
        // console.log(event.target.dataset.id);
        const subQuantity = event.target;
        //1.get item from cart
        const subItem = cart.find(
          (cItem) => cItem.id == subQuantity.dataset.id
        );
        if (subItem.quantity === 1) {
          this.removeItem(subItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
        }
        subItem.quantity--;
        //2.update cart value
        this.setCartValue(cart);
        //3.save cart
        Storage.saveCart(cart);
        //4.update cart item in UI
        subQuantity.previousElementSibling.innerText = subItem.quantity;
      }
      if (event.target.classList.contains("fa-trash")) {
        const removeItem = event.target;
        const _removeditem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removeditem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
      }
    });
  }
  clearCart() {
    //remove
    cart.forEach((cItem) => this.removeItem(cItem.id));
    //remove cartContent children
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    //update cart
    cart = cart.filter((cItem) => cItem.id !== id);
    //total price and cart items
    this.setCartValue(cart);
    //update storage
    Storage.saveCart(cart);
    this.getSingleButton(id);
  }
  getSingleButton(id) {
    // get add to cart btn => update text and disabled
    const button = buttonDOM.find((btn) => btn.dataset.id == parseInt(id));
    if (button) {
      button.innerText = "خرید";
      button.disabled = false;
    }
  }
}

//3.storage
class Storage {
  static savedProduct(product) {
    localStorage.setItem("products", JSON.stringify(product));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  // console.log("Loaded");
  const product = new Product();
  const productData = product.getproduct();
  const ui = new UI();
  ui.cartLogic();
  ui.setUpApp();
  ui.displayProduct(productData);
  ui.getAddToCartBtn();
  Storage.savedProduct(productData);
  // console.log(productData);
});

// Cart item Modal
showModalBtn.addEventListener("click", showModal);
function showModal() {
  modal.classList.add("top-1/3", "z-50");
  modal.classList.remove("-top-full");
  backDrop.classList.remove("hidden");
  modal.classList.remove("hidden");
}
confirmModal.addEventListener("click", () => {
  modal.classList.add("z-50", "-top-full");
  backDrop.classList.add("hidden");
  modal.classList.remove("top-1/3");
});
function closeModalFunction() {
  modal.classList.add("hidden");
  backDrop.classList.add("hidden");
}

// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

      // <form class="form-inline">
      //   <input class="quantity" type="number" value="1"></input>
      //   <button type="button" class="btn btn-primary add-to-cart">Add to Cart</button>
      // </form>

$(function() {

  var Store = function(items) {

    function Item(obj, quantity) {
      var self = this;

      self.id = obj.id;
      self.name = obj.name;
      self.picture_url = obj.picture_url;
      self.price = obj.price;
      self.quantity = quantity;

      self.cartTemplate = function() {
        var total = self.quantity * self.price;
        var cartHtml = "<strong>" + self.name + "</strong> \
          <br> \
          <img class='cart-img' src='" + self.picture_url + "'> \
          <p><strong>Quantity:</strong> " + self.quantity + "</p> \
          <p><strong>Total:</strong> $" + total + ".00</p>";

        var cartDiv = $("<div>").attr("id", "cart_" + self.id);
        cartDiv.html(cartHtml);

        return cartDiv;
      }
    };

    Item.find = function(id) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          return items[i];
        }
      }
    };

    function Cart(el) {
      var self = this;

      self.cartItems = [];

      self.bindListeners = (function() {
        $(".add-to-cart").click(function() {
          self.addToCart(this);
          self.renderCart();
        });

      })();

      self.addToCart = function(button) {
        var itemDiv = $(button).closest("div");
        var itemId = itemDiv.data("item-id");
        var quantity = itemDiv.find(".quantity").first().val();

        if (quantity < 1) {
          quantity = 1
        }

        var item = new Item(Item.find(itemId), quantity);
        self.cartItems.push(item);
      };

      self.renderCart = function() {
        el.empty();

        $(self.cartItems).each(function() {
          el.append(this.cartTemplate());
        });
      };

    };
    // bind listeners to cartAdd function
    // load anything already in session[:cart]
    // append base information to the sidebar
    // start by fetching items json
    // update cart
    // clear cart

    function Checkout() {};
    // collect user information
    // create order
    // add order_items
    // clear cart

    return {
      Item: Item,
      Cart: Cart,
      Checkout: Checkout
    }

  };

  $.getJSON('items.json', function(data) {
    var store = new Store(data);

    var cart = new store.Cart($("#sidebar"));
  });
});
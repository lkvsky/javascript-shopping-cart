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

$(function() {

  var Store = function(items) {

    function Item(obj, quantity) {
      var self = this;

      self.id = obj.id;
      self.name = obj.name;
      self.picture_url = obj.picture_url;
      self.price = obj.price;
      self.quantity = quantity;

      self.cartTotal = function() {
        return self.price * self.quantity;
      };

      self.cartTemplate = function() {
        var cartHtml = "<strong>" + self.name + "</strong> \
          <br> \
          <img class='cart-img' src='" + self.picture_url + "'> \
          <p><strong>Total:</strong>\
          $<span class='item-total'>" + self.cartTotal() + "</span>.00</p>\
          <p><strong>Quantity:</strong>\
          <input class='item-quantity' type='number' value='" + self.quantity + "'></p>";

        var cartDiv = $("<div>").attr("id", "cart_" + self.id);
        cartDiv.html(cartHtml);

        self.addListener(cartDiv);

        return cartDiv;
      };

      self.addListener = function(cartDiv){
        $(cartDiv).find(".item-quantity").focusout(function() {
          if ($(this).val() < 1) {
            $(this).val(0);
          }
          self.quantity = $(this).val();
          $(this).closest(cartDiv).find(".item-total").html(self.cartTotal());
        });
      };
    };

    Item.find = function(id, source) {
      var source = source || items;

      for (var i = 0; i < source.length; i++) {
        if (source[i].id === id) {
          return source[i];
        }
      }
    };

    function Cart(el) {
      var self = this;

      self.cartItems = [];

      self.cartTotal = function() {
        var total = 0;

        $(self.cartItems).each(function(){
          total += this.cartTotal();
        });
        return total;
      };

      self.bindListeners = (function() {
        $(".add-to-cart").click(function() {
          self.addToCart(this);
          self.renderCart();
          sessionStorage.setItem("shopping-cart", JSON.stringify(self.cartItems));
        });

        $("#shopping-cart").focusout(function() {
          $("#cart-total").html(self.cartTotal());
          sessionStorage.setItem("shopping-cart", JSON.stringify(self.cartItems));
        });

        $("#checkout").click(function() {
          $("#checkout-button").hide();
          $("#submit-order").show();
        });

        $("#place-order").click(function() {
          self.postOrder();
        });
      })();

      self.addToCart = function(button) {
        var itemDiv = $(button).closest("div");
        var itemId = itemDiv.data("item-id");
        var quantity = itemDiv.find(".quantity").first().val();

        if (quantity < 1) {
          quantity = 1
        }

        if (Item.find(itemId, self.cartItems)) {
          var item = Item.find(itemId, self.cartItems);
          var itemQuantity = parseInt(item.quantity) + parseInt(quantity);
          item.quantity = itemQuantity;
        } else {
          var item = new Item(Item.find(itemId), quantity);
          self.cartItems.push(item);
        }
      };

      self.renderCart = function() {
        el.empty();

        $(self.cartItems).each(function() {
          el.append(this.cartTemplate());
        });

        $("#cart-total").html(self.cartTotal());
      };

      self.populateFromSession = function(objects) {
        $(objects).each(function() {
          self.cartItems.push(new Item(this, this.quantity));
        });
      };

      self.collectOrder = function() {
        var inputs = $("#order-form").find("input");
        var postObj = {
          order: { order_items_attributes : {} }
        };

        inputs.each(function(){
          postObj.order[$(this).attr("name")] = $(this).val();
        });

        $(self.cartItems).each(function() {
          if (this.quantity !== 0) {
            postObj.order.order_items_attributes[this.id] = {
              quantity: this.quantity,
              item_id: this.id
            }
          }
        });

        return postObj;
      };

      self.postOrder = function() {
        var postHash = self.collectOrder();
        $.post("/orders", postHash, function(data) {
          sessionStorage.removeItem("shopping-cart");
          self.cartItems = [];
          self.renderCart();
          $("#checkout-button").show();
          $("#submit-order").hide();
        });
      }

    };

    return {
      Item: Item,
      Cart: Cart
    }

  };

  $.getJSON('/items.json', function(data) {
    var store = new Store(data);
    var cart = new store.Cart($("#shopping-cart"));
    var storageItems = JSON.parse(sessionStorage.getItem("shopping-cart")) || [];

    cart.populateFromSession(storageItems);
    cart.renderCart();
  });
});
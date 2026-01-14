/**
 * This code handles cart discount logic for either the cart drawer or cart page (depending on which iterator it gets)
 * It is called upon page load as well as if quantity is changed within the cart
 * @param {*} iterator
 * @returns {*}
 */
function calculateDiscount (iterator) {
  var SubTotalCart = 0;
  var totalCartDiscount = 0;
  var globalTotalCartDiscount = 0;

  iterator.each(function () {
    var itemCartDiscount = jQuery(this).find(".discount-text-item").attr("data-discount");
    var itemCartDiscountPrice = jQuery(this).find(".discount-text-item").attr("data-discount-price");
    var itemCartQty = 1;
    var globalItemCartDiscount = jQuery(this).find(".discount-text-item").attr("data-global-discount") || 0;

    if (jQuery(this).find(".js-qty__num").length > 0) {
      itemCartQty = jQuery(this).find(".js-qty__num").val();
    } else if (jQuery(this).find(".wk-qty__num").attr('value')) {
      itemCartQty = jQuery(this).find(".wk-qty__num").attr('value')
    }

    //Checkout rounding is on a per-item basis so we need to do some crazy math rounding here
    var finalCartDiscountPrice = Math.round(itemCartDiscountPrice * itemCartQty);
    var finalCartDiscount = Math.round(itemCartDiscount * itemCartQty);
    var finalGlobalCartDiscount = Math.round(globalItemCartDiscount * itemCartQty);
    if (itemCartDiscount % 1.0 === 0.5) {
      finalCartDiscount = Math.round((itemCartDiscount - 1.0) * itemCartQty);
    }
    if (globalItemCartDiscount % 1.0 === 0.5) {
      finalGlobalCartDiscount = Math.round((globalItemCartDiscount - 1.0) * itemCartQty);
    }

    totalCartDiscount = totalCartDiscount + finalCartDiscount;
    SubTotalCart = SubTotalCart + finalCartDiscountPrice;
    globalTotalCartDiscount =  globalTotalCartDiscount + finalGlobalCartDiscount;
  })

  // Take care of penny rounding issues
  if ((totalCartDiscount * 100) % 1 === 0.5) {
    totalCartDiscount -= 0.01
  }
  if ((globalTotalCartDiscount * 100) % 1 === 0.5) {
    globalTotalCartDiscount -= 0.01
  }

  return {
    SubTotalCart: SubTotalCart / 100.0,
    totalCartDiscount: totalCartDiscount / 100.0,
    globalTotalCartDiscount: globalTotalCartDiscount / 100.0,
  }
}

/**
 * Sets the message under the subtotal for the user
 * @param {string} discountString
 */
function updateCartDiscountString (discountString) {
  jQuery(".discount-text-drawer").html(discountString); // popover cart
  jQuery(".template-cart .discount-text-sub").html(discountString); // cart
}

/**
 * This code handles cart discount logic for either the cart drawer or cart page (depending on which page the user is on)
 * It is called upon page load as well as if quantity is changed within the cart
 * @param {*} iterator
 * @returns {*}
 */
function updateCartMessages () {
  var isCartPage = jQuery(".template-cart .cart__page-col .cart__item-group").length > 0
  var { SubTotalCart, totalCartDiscount, globalTotalCartDiscount } = isCartPage
    ? calculateDiscount(jQuery(".template-cart .cart__page-col .cart__item-group"))
    : calculateDiscount(jQuery(".site-header__drawer .cart__item-group"))

  // Convert SubTotalCart from dollars to cents and format using Shopify's currency formatter
  var subtotalInCents = Math.round(SubTotalCart * 100);
  var formattedSubtotal = theme.Currency.formatMoney(subtotalInCents, theme.settings.moneyFormat);
  jQuery("div#data-subtotal").html(formattedSubtotal);

  if (totalCartDiscount > 0) {
    // Format discount amount using Shopify's currency formatter
    var discountInCents = Math.round(totalCartDiscount * 100);
    var formattedDiscount = theme.Currency.formatMoney(discountInCents, theme.settings.moneyFormat);
    var discountLine = "Gaia Members Save "
    var discountString = discountLine + formattedDiscount
    updateCartDiscountString(discountString)
  } else if (globalTotalCartDiscount > 0) {
    var discountInCents = Math.round(globalTotalCartDiscount * 100);
    var formattedDiscount = theme.Currency.formatMoney(discountInCents, theme.settings.moneyFormat);
    if (isInTrial) {
      var discountString = "After your trial period, you'll be able to save " + formattedDiscount
    } else {
      var discountString = "If you were a Gaia member, you would save " + formattedDiscount
      discountString += '<br/><a href="https://www-stg-4b2c19.gaia.com/mp-login?redirect=%2Fcart" class="text-link">Log In</a> or <a href="https://www-stg-4b2c19.gaia.com/go?sku=G%201M%20TS&utm_source=marketplace" class="text-link">Sign Up</a> to save'
    }
    updateCartDiscountString(discountString)
  } else {
    updateCartDiscountString('')
  }
}

function revealDropDownOnLoad () {
  jQuery('[dropdown-expanded="true"]').click();
}

function bindButtonsWithID() {
  jQuery('[href^="#"]').on("click", function(e) {
    e.preventDefault();
    var href = jQuery(this).attr('href');

    jQuery('html, body').animate({
      scrollTop: jQuery(href).offset().top
    }, 800, function () {
      // Add hash (#) to URL when done scrolling (default click behavior)
      window.location.hash = href;
    });
  });
}

jQuery(window).on("load", function () {
  updateCartMessages();
  revealDropDownOnLoad();
  bindButtonsWithID();
});

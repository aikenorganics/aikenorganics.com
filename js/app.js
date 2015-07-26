var $ = window.jQuery = require('jquery')
require('bootstrap')

var $message = $('#message')
var messageTimeout = setTimeout(function () {
  $message.removeClass('active')
}, 10000)

var message = function (type, message) {
  clearTimeout(messageTimeout)
  $message.html(
    "<span class='alert alert-" + type + "'>" + message + "</span>"
  ).addClass('active')
  messageTimeout = setTimeout(function () { $message.removeClass('active') }, 10000)
}

$(document).on('click', '[data-confirm]', function (e) {
  if (!confirm($(e.target).data('confirm'))) {
    e.preventDefault()
  }
})

$(document).on('submit', 'form', function (e) {
  $(e.target).find(':button,:submit').prop('disabled', true)
  message('info', 'Working…')
})

$('script[data-cart]').each(function (i, el) {
  var data = JSON.parse(el.innerHTML)
  var $form = $("<form class='form-inline'></form>").replaceAll(el)

  $form.on('submit', function (e) {
    e.preventDefault()
    var $input = $form.find('input')
    $.ajax({
      url: '/cart',
      method: 'post',
      dataType: 'json',
      data: {
        product_id: data.product_id,
        quantity: $input.length ? $input.val() : 1
      },
      success: function (res) {
        data = res
        message('success', data.message)
        update()
      },
      error: function (xhr) {
        try {
          message(JSON.parse(xhr.responseText).message)
        } catch (e) { }
      }
    })
  })

  update()

  function update () {
    if (data.quantity > 0) {
      $form.html(
        "<div class='form-group'>" +
        "<label for='quantity'>In Cart:&nbsp;</label>" +
        "<div class='input-group'>" +
          "<input type='number' min='0' max='" + data.available + "' class='form-control' value='" + data.quantity + "'>" +
          "<div class='input-group-btn'>" +
            "<button type='submit' class='btn btn-primary'>Update</button>" +
          "</div>" +
        "</div>" +
        "</div>"
      )
    } else {
      $form.html(
        "<button type='submit' class='btn btn-primary'>Add to Cart</button>"
      )
    }
  }

})

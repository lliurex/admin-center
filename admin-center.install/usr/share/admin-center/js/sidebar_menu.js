

function initMenu() {
  $('#menu ul').hide();
  $('#menu ul').children('.current').parent().show();
  //$('#menu ul:first').show();
  $('#menu li a').click(
    function() {
      var checkElement = $(this).next();
      if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
        return false;
        }
      if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
        $('#menu ul:visible').slideUp('normal');
        checkElement.slideDown('normal');
        $(checkElement).addClass("submenu");
        return false;
        }
      }
    );
  }

$(document).ready(function() {
  initMenu();

  /*$("#menu-toggle").bind("click", function(e) {
          e.preventDefault();
          $("#wrapper").toggleClass("toggled");
      });*/

    $("#menu-toggle-2").on("click",function(e) {
          e.stopPropagation();
          e.preventDefault();
          $("#sidebar-wrapper").css("width", "250px");
    });
    
    /*$("#bt_hide_menu_container").on("click",function(e) {
          e.stopPropagation();
          e.preventDefault();
          $("#sidebar-wrapper").css("width", "0px");
  });*/
    
     $("body").on("click",function() {
          $("#sidebar-wrapper").css("width", "0px");
  });
    
});

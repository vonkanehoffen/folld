// Folld Interface JS

var xhr, prev_url;

$(document).ready(function(){
	console.log("interface.js Loaded");

	// Spider URLs for Content -------------------------------------------------
    
    var link_uri = $('input#link_uri');

    // Add transport to URL as it's typed
    
    $('body').on('keyup', 'input#link_uri', function(){
        console.log("link_uri.keyup");
        var url = $(this).val();
        if( is_url(url) ) {
            if( !has_transport(url) ) {
                $(this).val('http://'+url);
                url = $(this).val();
            }
        }   

        var url = $(this).val();
        if (is_url(url) && url != prev_url) {
            get_url_meta(url);
            prev_url = url;
        }
    })
    
    function get_url_meta(url) {
        console.log("get_url_meta");
        var link_title = $('input#link_title');

        link_title.addClass('loading');
        if(xhr) { xhr.abort(); }
        xhr = $.ajax({
            url: '/node/',
            dataType: 'json',
            type: 'GET',
            data: { fn: 'scrape_title', url: url },
            success: function(data) {
                console.log("data: ",data);
                link_title.val(data.title);
                link_title.removeClass('loading');
            }
        })
    }

    // Setup masonry layout ---------------------------------------------------

    $('#main.links_view').masonry({
        itemSelector: '.masonry_item',
        //gutterWidth: 20,
        columnWidth: function( containerWidth ) {
            return containerWidth / 3;
        }
    });

    // Add non-UJS interface handlers -----------------------------------------

    $('a#add_new_link').on('click', function(){
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('form#new_link').remove();
            reload_masonry();
            return false;
        }
    });

    $(document).on('click', 'form.edit_link .cancel', function() {
        $(this).parents('.link').find('.show').show();
        $(this).parents('form').remove();
        reload_masonry();
        return false;
    });

})

// Helpers --------------------------------------------------------------------

function is_url(url) {
    // TODO: This doesn't validate URLs like: http://www.kvraudio.com/forum/viewtopic.php?p=5238905
    // ....and might crash chrome?
    // And this: http://www.google.com/fonts/#QuickUsePlace:quickUse/Family:
    if(url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
        return true; } else { return false; }
}

function has_transport(url) {
    if(url.match(/^https?:\/\//)) {
        return true; } else { return false; }
}

function flash(type, msg) {
    var flash = $('<div></div>');
    flash.addClass(type);
    flash.html(msg);
    $('#flash').append(flash);
    flash.delay(1500).fadeOut();
}

function reload_masonry() {
    $('#main').masonry('reload');
}

// Folld Interface JS

var xhr;

$(document).ready(function(){
	console.log("interface.js Loaded");

	// Spider URLs for Content -------------------------------------------------
    
    var link_uri = $('input#link_uri');
    var link_title = $('input#link_title');

    // Add transport to URL as it's typed
    
    link_uri.keyup(function(){
        console.log("link_uri.keyup");
        var url = $(this).val();
        if( is_url(url) ) {
            if( !has_transport(url) ) {
                $(this).val('http://'+url);
                url = $(this).val();
            }
        }   

        var url = $(this).val();
        if (is_url(url) && has_transport(url)) {
            get_url_meta(url);	
        }
    })
    
    function get_url_meta(url) {
    	console.log("get_url_meta");
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
})

// Helpers ---------------------------------------------------------------------

function is_url(url) {
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

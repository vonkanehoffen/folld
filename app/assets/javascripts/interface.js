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

    // Setup tiles layout ---------------------------------------------------

    folld.tiles.init();
    folld.tiles.resize();
    $(window).resize(function(){
        if(folld.tiles.col_count != folld.tiles.get_col_count()) folld.tiles.init();
       folld.tiles.resize();
    });
                   
    // Add non-UJS interface handlers -----------------------------------------

    $('a#add_new_link').on('click', function(){
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('form#new_link').remove();
            return false;
        }
    });

    $(document).on('click', 'form.edit_link .cancel', function() {
        $(this).parents('.link').find('.show').show();
        $(this).parents('form').remove();
        return false;
    });

})

var folld = {
    is_url: function(url) {
        // TODO: This doesn't validate URLs like: http://www.kvraudio.com/forum/viewtopic.php?p=5238905
        // ....and might crash chrome?
        // And this: http://www.google.com/fonts/#QuickUsePlace:quickUse/Family:
        if(url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
            return true; 
        } else { 
            return false; 
        }
    },

    has_transport: function(url) {
        if(url.match(/^https?:\/\//)) {
            return true; } else { return false; }
    },

    flash: function(type, msg) {
        var flash = $('<div></div>');
        flash.addClass(type);
        flash.html(msg);
        $('#flash').append(flash);
        flash.delay(1500).fadeOut();
    },

    tiles: {
        threshold: {
            1: 500,
            2: 650,
            3: 900,
            4: 1200,
            5: 1600
        },
        cols: {},
        get_col_count: function() {
            // Find correct column count for page width
            var col_count = 1;
            var thresh = folld.tiles.threshold;
            var width = $('.tiles_outer').width();
            for(var num in thresh) {
                if(width > thresh[num]) { 
                    col_count = num 
                }
            }
            
            return col_count;
        },
        init: function() {
            folld.tiles.col_count = folld.tiles.get_col_count();
            col_count = folld.tiles.col_count;

            // Create column containers
            for(var i=0; i<col_count; i++) {
                folld.tiles.cols[i] = $('<div class="tiles_col"><div class="inner"></div></div>');
            }

            // Move tiles into columns
            var current = 0;
            $('.tiles_item').each(function(i){
                folld.tiles.cols[current].find('.inner').append($(this));
                current++;
                if(current>=col_count) { current = 0; }
            });

            // Attach columns to the DOM
            $('.tiles_col').remove();
            for(var i=0; i<col_count; i++) {
                $('.tiles_inner').append(folld.tiles.cols[i]);
            }

        },
        resize: function() {
            var outer_width = $('.tiles_outer').width();
            console.log("outer ",outer_width);
            var col_width = Math.floor(outer_width/folld.tiles.col_count);

            $('.tiles_inner').width(outer_width);
            $('.tiles_col').width(col_width);
        }
    }
}


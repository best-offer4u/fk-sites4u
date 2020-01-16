(function ($) {
	function getAttributes(el) {

        var attributes = {};
        if ($(el).length) {
            $.each($(el)[0].attributes, function (index, attr) {
                attributes[ attr.name ] = attr.value;
            });
        }

        return attributes;
    }

    function rating() {
        $(".ratingStars").jRating({
            'rateMax': 100,
            onSuccess: function () {
                $("#ratingStarsMessage").text("Thanks for voting!");
            },
            onError: function () {
                $("#ratingStarsMessage").text("Sorry, you've already voted.");
            }
        }, 'json');
    }

    function setMaxHeightForReview() {
        var $text_holder = $('[data-max-height]');
        var max_height = $text_holder.attr('data-max-height');
        var $button = $('.js-show-text');

        if ($text_holder.parent().hasClass('site-desc')) { //if site review page
            if (window.innerWidth <= 768) {
                max_height = 250;
            } else if (max_height == 'dynamic') {
                max_height = $('.left-column').height() - $('.site-name').outerHeight(true) - $('.btn-site-action-holder').outerHeight(true) - $('.js-show-text').outerHeight(true);
            }
        }
        
        if ($text_holder.height() > max_height) {
            $text_holder.css('height', max_height);
            $button.show();
        }

        $button.on('click', function() {
            $(this).toggleClass('active');
            $text_holder.toggleClass('full');
            $button.find('.text').toggle();
        });
    }

    function showAbout() {
        $('.js-show-about').on('click', function() {
            $('.about-text').toggle();
            window.scrollTo(0,document.body.scrollHeight);

            return false;
        });
    }
	
	function buildNewModal(c, options) {
        var defaults = {};
        var settings = $.extend(true, {}, defaults, options);
        var current_modal;
        var modal_markup = '<div id="' + settings.id + '-modal" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '<h4 class="modal-title">' + settings.title + '</h4>'
                + '</div><div class="modal-body">'
                + c
                + '</div>'
                + '<div class="modal-footer"><button class="btn btn-default" data-dismiss="modal" type="button">' + settings.closeTitle + '</button></div>'
                + '</div></div></div>';
        $("body").append(modal_markup);
        if (typeof c == "object") {
            $("#" + settings.id + "-modal").find(".modal-body").text("").append(c);
        }

        current_modal = $("#" + settings.id + "-modal");
        current_modal.modal("show");
        // CLOSE MODAL
        current_modal.on('hidden.bs.modal', function () {
            current_modal.remove();
        });
    }

    // MODALS
    function modalWindows(a) {
        var sett = {
            btn: $("[data-mb='modal']"),
        }
        sett.btn.on("click", function (e) {
            e.preventDefault();
            var aa = getAttributes($(this));
            var bw = (aa["data-opt-iframe-width"] ? aa["data-opt-iframe-width"] : "100%");
            var bh = (aa["data-opt-iframe-height"] ? aa["data-opt-iframe-height"] : "150px");
            var modalOptions = {
                rand: Math.floor((Math.random(0, 9999)) * 1000),
                closeTitle: (aa["data-opt-close"] ? aa["data-opt-close"] : "Close"),
                id: (aa["id"] ? aa["id"] : "modal-" + this.rand),
                title: (aa["title"] ? aa["title"] : "Popup"),
            };
            if (aa["data-opt-type"] == "iframe") {
                var content = '<iframe src="' + aa["href"] + '" style="width:' + bw + ';height:' + bh + ';"></iframe>';
                buildNewModal(content, modalOptions);
            } else {
                if (typeof xhr == 'object') {
                    xhr.abort();
                }

                xhr = $.ajax({
                    url: aa["href"],
                    type: 'GET',
                    dataType: 'html',
                    cache: false,
                    crossDomain: false,
                    data: {
                        //langSelected: langVal
                    },
                    success: function (data) {
                        var decodedStr = $("<div/>").html(data);
                        if (!data.match(/<body>/)) {
                            var content = data;
                        } else {
                            var content = decodedStr.children().not("meta, link");
                        }

                        if ($('#add-fav').length && loggedIn === 1) {
                            if ($('#add-fav').attr('data-action') == 'remove') {
                                $('#add-fav').attr('href', _basehttp + '/action.php?action=add_favorites&id=' + aa['data-id']);
                                $('#add-fav').attr('data-action', 'add');
                                $('#add-fav').attr('title', addFav);
                                $('#add-fav > .sub-label').html(addFav);
                            } else {
                                $('#add-fav').attr('href', _basehttp + '/action.php?action=remove_favorites&id=' + aa['data-id']);
                                $('#add-fav').attr('data-action', 'remove');
                                $('#add-fav').attr('title', delFav);
                                $('#add-fav > .sub-label').html(delFav);
                            }
                        }

                        buildNewModal(content, modalOptions);
                    },
                    error: function (data) {
                        content = data;
                    }
                });
            }
        });
    }

    $(document).ready(function () {

        $('.expand').click(function () {
            $('.network-col').toggleClass('expanded');
        });

        $.scrollUp({
            scrollName: 'scrollUp', // Element ID
            topDistance: '300', // Distance from top before showing element (px)
            topSpeed: 3200, // Speed back to top (ms)
            scrollSpeed: 800, // Speed back to top (ms)
            easingType: 'easeInOutQuart', // Scroll to top easing (see http://easings.net/)
            animation: 'fade', // Fade, slide, none
            animationInSpeed: 200, // Animation in speed (ms)
            animationOutSpeed: 200, // Animation out speed (ms)
            scrollText: '', // Text for element
            activeOverlay: false // Set CSS color to display scrollUp active point, e.g '#00FFFF'
        });

        if ($(".ratingStars").length) {
            rating();
        }

        setMaxHeightForReview();
        
        modalWindows();
        
        showAbout();
    });

    $(window).load(function () {
        
        $('#sitesList').masonry({
            itemSelector: '.list-shadow',
            isFitWidth: true,
            // percentPosition: true
        });

        $('#sitesList').removeClass('loading');
    });

    $(window).resize(function () {
        
    });

}(jQuery));
$(function () {
    var campaign_id = $('meta[name="campaign_id"]').attr('content');
    var template_id = $('meta[name="template_id"]').attr('content');
    $.ajax({
        url: '/api/track-event',
        type: 'POST',
        dataType: "json",
        asyc: false,
        cache: false,
        data: {
            template_id: template_id,
            campaign_id: campaign_id,
            event: 'page_open',
            label: 'page_open',
            name: 'page_open',
            value: 1,
        },
        success: function (content) {
        }
    });
    $(document).on('click', 'a', function () {
        var elem = $(this);
        var label = 'out';
        if (elem.attr('class') == 'mailto') {
            var label = 'mailto';
        }

        $.ajax({
            url: '/api/track-event',
            type: 'POST',
            dataType: "json",
            cache: false,
            asyc: false,
            data: {
                template_id: template_id,
                campaign_id: campaign_id,
                event: 'navigate',
                label: label,
                name: elem.text(),
                value: elem.attr('href'),
            },
            success: function (content) {
            },
            complete: function () {
                redirect_url = elem.data('onclick');
                if (redirect_url.length) {
                    window.location.href = redirect_url;
                }
            }

        });
    });


    setTimeout(function () {
        $.ajax({
            url: '/api/track-event',
            type: 'POST',
            dataType: "json",
            cache: false,
            asyc: false,
            data: {
                template_id: template_id,
                campaign_id: campaign_id,
                event: 'read',
                label: 'read the page',
                name: 'read the page',
                value: 1,
            },
            success: function (content) {
            },
        });
    }, 10000);

});

jQuery(document).ready(function ($) {
    var broken_linkId = 0;

    $('.broken_filter').multiselect({
        nonSelectedText: wpms_localize.filter_by,
        enableFiltering: false,
        enableCaseInsensitiveFiltering: false,
        buttonWidth:'250px'
    });

    $('.form-group-broken .btn-group').on('click', function () {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this).find('.multiselect.dropdown-toggle').attr('aria-expanded', false);
        } else {
            $(this).addClass('open');
            $(this).find('.multiselect.dropdown-toggle').attr('aria-expanded', true);
        }
    });

    /*
     * Scan all link in posts , pages and comments
     */
    $('.wpms_scan_link').on('click', function () {
        var $this = $(this);
        wpmsScanLink($this);
    });

    $('.wpms_flush_link').on('click', function () {
        var flush_val = $('#filter-by-flush').val();
        if (flush_val !== 'none') {
            $('#wp-seo-meta-form .wpms-spinner-flush').css('visibility', 'visible').show();
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: {
                    'action': 'wpms',
                    'task': 'flush_link',
                    'type': $('#filter-by-flush').val(),
                    'wpms_nonce': wpms_localize.wpms_nonce
                },
                success: function () {
                    $('#wp-seo-meta-form .wpms-spinner-flush').hide();
                    $('.flush-msg-success').fadeIn(1000).delay(200).fadeOut(2000);
                    setTimeout(function () {
                        window.location.assign(document.URL);
                    },3000);
                }
            });
        } else {
            $('.flush-msg-error').fadeIn(1000).delay(200).fadeOut(2000);
        }
    });

    // show , hide custom redirect form
    $('.wpms_add_custom_redirect').on('click', function () {
        if ($('.custom_redirect_editor_content').hasClass('show')) {
            $('.custom_redirect_editor_content').removeClass('show');
        } else {
            $('.custom_redirect_editor_content').addClass('show');
        }
    });

    // Add custom redirect
    $('.btn_add_redirect').on('click', function () {
        var new_link = $('.custom_redirect_url').val();
        var status_link = $('.custom_redirect_status').val();
        var new_text = '(None)';
        var link_redirect = $('.custom_redirect_url_redirect').val();

        if (new_link === '') {
            alert('Error: Link URL must not be empty');
        } else {
            $.ajax({
                url: ajaxurl,
                method: 'POST',
                dataType: 'json',
                data: {
                    'action': 'wpms',
                    'task': 'add_custom_redirect',
                    'new_link': new_link,
                    'new_text': new_text,
                    'link_redirect': link_redirect,
                    'status_link_redirect': status_link,
                    'type' : 'add_custom',
                    'wpms_nonce': wpms_localize.wpms_nonce
                },
                success: function (res) {
                    if (!res.status) {
                        alert(res.message);
                    } else {
                        window.location.assign(document.URL);
                    }
                }
            });
        }
    });

    //  update link use wplink of wordpress
    $('.wpms-inline-editor-content #link-btn').on('click', function () {
        broken_linkId = $(this).closest('tr').data('linkid');
        if (typeof wpLink !== "undefined") {
            wpLink.open('link-btn');
            /* Bind to open link editor! */
            $('#wp-link-backdrop').show();
            $('#wp-link-wrap').show();
            $('#url-field,#wp-link-url').closest('div').find('span').html('Link To');
            $('#link-title-field').closest('div').hide();
            $('.wp-link-text-field').hide();

            $('#url-field,#wp-link-url').val($('.compat-field-wpms_gallery_custom_image_link input.text').val());
            if ($('.compat-field-gallery_link_target select').val() === '_blank') {
                $('#link-target-checkbox,#wp-link-target').prop('checked', true);
            } else {
                $('#link-target-checkbox,#wp-link-target').prop('checked', false);
            }
        }
    });

    $('#wp-link-submit').on('click', function () {
        var broken_link = $('#wp-link-url').val();
        $('.metaseo_images tr[data-linkid="'+ broken_linkId +'"]').find('.wpms-link-redirect-field').val(broken_link);
    });

    /*
     * Edit a link
     */
    $('.wpms-edit-button').on('click', function () {
        $(this).closest('td').find('.wpms-inline-editor-content').show();
    });

    /*
     * Cancel edit link
     */
    $('.wpms-cancel-button').on('click', function () {
        $(this).closest('td').find('.wpms-inline-editor-content').hide();
    });

    $('.custom_redirect_editor_content .wpms-cancel-button').on('click', function () {
        $('.custom_redirect_editor_content').removeClass('show');
    });

    /*
     * Update a link
     */
    $('.wpms-update-link-button').on('click', function () {
        var $this = $(this);
        var link_id = $this.data('link_id');
        var new_link = $this.closest('td').find('.wpms-link-url-field').val();
        var status_redirect = $this.closest('td').find('.custom_redirect_status').val();
        var new_text = $this.closest('td').find('.wpms-link-text-field').val();
        var link_redirect = $this.closest('td').find('.wpms-link-redirect-field').val();
        var data_type = $this.closest('td').find('.wpms-link-text-field').data('type');
        if (new_link === '') {
            alert('Error: Link URL must not be empty');
        } else {
            wpms_update_link($this, link_id, new_link, new_text, link_redirect, data_type,status_redirect);
        }
    });

    /*
     * Remove link
     */
    $('.wpms-unlink-button').on('click', function () {
        var $this = $(this);
        var link_id = $this.data('link_id');
        wpms_unlink($this, link_id);
    });

    /*
     * Recheck link
     */
    $('.wpms-recheck-button').on('click', function () {
        var $this = $(this);
        var link_id = $this.data('link_id');
        wpms_recheck_link($this, link_id);
    });

    /*
     * Do recheck link
     */
    function wpms_recheck_link($this, link_id) {
        var oldColor = $this.closest('tr').css('background-color');
        $this.closest('tr').css({'background-color': "rgba(0, 115, 170, 0.1)"});
        $.ajax({
            url: ajaxurl,
            method: 'POST',
            dataType: 'json',
            data: {
                'action': 'wpms',
                'task': 'recheck_link',
                'link_id': link_id,
                'wpms_nonce': wpms_localize.wpms_nonce
            },
            success: function (res) {
                if (res.status) {
                    var status = res.status_text;
                    if (status.indexOf('404') !== -1 || status === 'Server Not Found') {
                        $this.closest('tr').find('.col_status').html('<i class="material-icons wpms_warning metaseo_help_status" data-tippy="404 error, not found">warning</i>');
                    } else if (status.indexOf('200') !== -1) {
                        $this.closest('tr').find('.col_status').html('<i class="material-icons wpms_ok metaseo_help_status" data-tippy="Link is OK">done</i>');
                    } else if (status.indexOf('301') !== -1) {
                        $this.closest('tr').find('.col_status').html('<i class="material-icons wpms_ok metaseo_help_status" data-tippy="Permanent redirect">done</i>');
                    } else if (status.indexOf('302') !== -1) {
                        $this.closest('tr').find('.col_status').html('<i class="material-icons wpms_ok metaseo_help_status" data-tippy="Moved temporarily">done</i>');
                    } else {
                        $this.closest('tr').find('.col_status').html(res.status_text);
                    }
                    wpms_tooltip();
                    $this.closest('tr').css({'background-color': oldColor});
                }
            }
        });
    }

    /*
     * Do remove link
     */
    function wpms_unlink($this, link_id) {
        $this.closest('tr').css({'background-color': "rgba(0, 115, 170, 0.1)"});
        $.ajax({
            url: ajaxurl,
            method: 'POST',
            dataType: 'json',
            data: {
                'action': 'wpms',
                'task': 'unlink',
                'link_id': link_id,
                'wpms_nonce': wpms_localize.wpms_nonce
            },
            success: function (res) {
                if (res) {
                    $this.closest('tr').remove();
                }
            }
        });
    }

    /*
     * Do update link
     */
    function wpms_update_link($this, link_id, new_link, new_text, link_redirect, data_type,status_redirect) {
        $.ajax({
            url: ajaxurl,
            method: 'POST',
            dataType: 'json',
            data: {
                'action': 'wpms',
                'task': 'update_link_redirect',
                'link_id': link_id,
                'new_link': new_link,
                'new_text': new_text,
                'link_redirect': link_redirect,
                'data_type': data_type,
                'status_redirect': status_redirect,
                'wpms_nonce': wpms_localize.wpms_nonce
            },
            success: function (res) {
                if (res.status) {
                    $this.closest('td').find('.wpms-inline-editor-content').hide();
                    //if(res.type != '404_automaticaly'){
                    $this.closest('td').find('.link_html').html(new_link).attr('href', wpms_localize.home_url + '/' + new_link);
                    $this.closest('td').find('.link_html_redirect').html(link_redirect).attr('href', wpms_localize.home_url + '/' + link_redirect);
                    $this.closest('tr').find('.col_status').html(res.status_text);

                    var status = res.status_text;
                    if (status.indexOf('404') !== -1 || status === 'Server Not Found') {
                        $this.closest('tr').find('.col_status').html('<i class="material-icons wpms_warning metaseo_help_status" data-tippy="404 error, not found">warning</i>');
                    } else if (status.indexOf('200') !== -1) {
                        $this.closest('tr').find('.col_status').html('<i class="material-icons wpms_ok metaseo_help_status" data-tippy="Link is OK">done</i>');
                    } else if (status.indexOf('301') !== -1) {
                        $this.closest('tr').find('.col_status').html('<i class="material-icons wpms_ok metaseo_help_status" data-tippy="Permanent redirect">done</i>');
                    } else if (status.indexOf('302') !== -1) {
                        $this.closest('tr').find('.col_status').html('<i class="material-icons wpms_ok metaseo_help_status" data-tippy="Moved temporarily">done</i>');
                    } else {
                        $this.closest('tr').find('.col_status').html(res.status_text);
                    }
                    wpms_tooltip();
                    //}

                    if (res.type === 'url') {
                        if (res.new_text !== '') {
                            $this.closest('tr').find('.link_text').html(new_text);
                        }
                    }
                }
            }
        });
    }

    /*
     * Open tippy
     */
    function wpms_tooltip() {
        tippy('.referrers_tippy', {
            animation: 'scale',
            duration: 0,
            arrow: false,
            placement: 'top',
            theme: 'metaseo-tippy tippy-rounded',
            onShow(instance) {
                instance.popper.hidden = instance.reference.dataset.tippy ? false : true;
                instance.setContent(instance.reference.dataset.tippy);
            }
        });
        tippy('.metaseo_help_status', {
            animation: 'scale',
            duration: 0,
            arrow: false,
            placement: 'top',
            theme: 'metaseo-tippy tippy-rounded',
            onShow(instance) {
                instance.popper.hidden = instance.reference.dataset.tippy ? false : true;
                instance.setContent(instance.reference.dataset.tippy);
            }
        });
    }

    wpms_tooltip();
});
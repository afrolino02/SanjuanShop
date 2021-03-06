<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');
?>
<!--WPMS Google Analytics universal tracking js code - https://wordpress.org/plugins/wp-meta-seo/ -->
<script>
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', '<?php echo esc_html($this->gaDisconnect['wpms_gg_service_tracking_id']); ?>', 'auto');
    ga('send', 'pageview');
</script>
<!--End WPMS Google Analytics universal tracking js code-->
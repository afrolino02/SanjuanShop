<?php
/* Prohibit direct script loading */
defined('ABSPATH') || die('No direct script access allowed!');

if (!class_exists('WpmsTagManagerController')) {

    /**
     * Class WpmsTagManagerController
     */
    class WpmsTagManagerController
    {
        /**
         * Google API client
         *
         * @var \WPMSGoogle\Client
         */
        public $client;
        /**
         * Google service tag manager
         *
         * @var Google_Service_TagManager
         */
        public $tagmanager_service;

        /**
         * WpmsTagManagerController constructor.
         */
        public function __construct()
        {
            $google_alanytics = get_option('wpms_google_alanytics');
            include_once(WPMETASEO_PLUGIN_DIR . 'inc/lib/google-api/vendor/autoload.php');

            $this->client = new WPMSGoogle\Client();
            $this->client->setScopes(array(
                'https://www.googleapis.com/auth/tagmanager.edit.containers',
                'https://www.googleapis.com/auth/analytics.readonly'
            ));
            $this->client->setAccessType('offline');
            $this->client->setApplicationName('WP Meta SEO');
            $this->client->setRedirectUri('urn:ietf:wg:oauth:2.0:oob');
            $this->managequota = 'u' . get_current_user_id() . 's' . get_current_blog_id();
            $this->client->setClientId($google_alanytics['wpmsga_dash_clientid']);
            $this->client->setClientSecret($google_alanytics['wpmsga_dash_clientsecret']);
            $this->tagmanager_service = new Google_Service_TagManager($this->client);
            if (!empty($google_alanytics['googleCredentials'])) {
                $token = $google_alanytics['googleCredentials'];
                if ($token) {
                    $this->client->setAccessToken($token);
                }
            }
        }

        /**
         * Get list GTM accounts
         *
         * @return Google_Service_TagManager_ListAccountsResponse
         */
        public function getListAccounts()
        {
            return $this->tagmanager_service->accounts->listAccounts();
        }

        /**
         * Get list GTM containers
         *
         * @param string $account_id GTM account ID
         *
         * @return Google_Service_TagManager_ListContainersResponse
         */
        public function getListContainers($account_id)
        {
            return $this->tagmanager_service->accounts_containers->listAccountsContainers('accounts/' . $account_id);
        }
    }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Apk extends CI_Controller {

    /**
    * Index Page for this controller.
    *
    * Maps to the following URL
    *         http://example.com/index.php/welcome
    *    - or -
    *         http://example.com/index.php/welcome/index
    *    - or -
    * Since this controller is set as the default controller in
    * config/routes.php, it's displayed at http://example.com/
    *
    * So any other public methods not prefixed with an underscore will
    * map to /index.php/welcome/<method_name>
    * @see https://codeigniter.com/user_guide/general/urls.html
    */
    function __construct()
    {
        parent::__construct();  

    }

    public function index()
    {                 
        $file_name="app.apk"; 
        $file = getcwd() . "/application/assets/".$file_name;     

        if (file_exists($file)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/vnd.android.package-archive');
            header('Content-Disposition: attachment; filename='.basename($file));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            ob_clean();
            flush();
            readfile($file);
            exit;
        }

    }
}
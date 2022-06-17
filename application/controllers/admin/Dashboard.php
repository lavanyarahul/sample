<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends CI_Controller {
 
    function __construct()
    {
        parent::__construct();  
      

    }

    public function index()
    {
        /*	$employees = $this->dm->employees_count();
        $facilities = $this->dm->facilities_count();
        $bookings = $this->dm->bookings_count();
        $list_todays_facility= $this->dm->list_todays_facility();*/
        $data = array(
        'page' => 1,  
        'sub_page' => 0,     
        'page_name' => 'Dashboard',
        'js_name' => 'dashboard',                    
        );

        $this->load->view('admin/header',$data);
        $this->load->view('admin/dashboard_view');
        $this->load->view('admin/footer');

    }

}

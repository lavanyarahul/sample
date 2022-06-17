<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Validation extends CI_Controller {

 	function __construct()
    {
        parent::__construct();  
        $this->load->model('validation_model','vm');                                               
    }
 
	public function add_duplicate(){
	   
	    $data=$this->vm->addDuplicate();
	    echo json_encode($data);    
	}    

	public function edit_duplicate(){

	    $data=$this->vm->EditDuplicate();
	    echo json_encode($data);    
	}
	

}

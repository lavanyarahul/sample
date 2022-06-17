<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {
 
    function __construct()
    {
        parent::__construct();  
        $this->load->model('login_model','lm');  
 
    }

    public function index()
    {
          $this->load->view('login_view');
    }
    public function login()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        if($method != 'POST'){
            json_output(400,array('status' => 400,'message' => 'Bad request.'));
        } else {
            $check_auth_client = $this->lm->check_auth_client();
            if($check_auth_client == true){
                /* $params = json_decode(file_get_contents('php://input'), TRUE);
                $params['username'];
                $password = $params['password'];*/
                $username = $this->input->post('email');
                $password = $this->input->post('password');
                $response = $this->lm->login($username,$password);
                if($response['status'] == 200){
                    $response['url'] = $this->validate_redirect($response['role_id']);   
                    echo json_encode($response);
                }
            }
        }
    }

    private function validate_redirect($role_id){
        switch ($role_id) {
            case 1:   
               return $url = base_url().'admin/dashboard';
                break;
            case 2:   
                return $url =   base_url().'branch/dashboard'; 
                break;
            case 3:   
                return $url = base_url().'dept/dashboard'; 
                break;
            case 4:   
                return $url = base_url().'engineer/dashboard'; 
                break;
            default:
                return $url = base_url().'login'; 
                break;
        }  
    }

    public function logout()
    {    
        $method = $_SERVER['REQUEST_METHOD'];
        if($method != 'POST'){
            json_output(400,array('status' => 400,'message' => 'Bad request.'));
        } else {
            $check_auth_client = $this->lm->check_auth_client();
            if($check_auth_client == true){
                $response = $this->lm->logout();
                json_output($response['status'],$response);
            }
        }
    }
 
}

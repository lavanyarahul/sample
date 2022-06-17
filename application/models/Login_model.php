<?php class Login_model extends CI_Model{

    public function __construct() {        
        parent::__construct();
    }

    var $client_service = "frontend-client";
    var $auth_key       = "simplerestapi";

    public function check_auth_client(){
         $client_service = $this->input->get_request_header('Client-Service', TRUE);
         $auth_key  = $this->input->get_request_header('Auth-Key', TRUE);

        if($client_service == $this->client_service && $auth_key == $this->auth_key){
            return true;
        } else {
            return array('status' => 401,'message' => 'Unauthorized.');
        }
    }

    public function login($username,$password)
    {
        $q  = $this->db->select('password,user_id')->from('users')->where('email',$username)->get()->row();
        if($q == ""){
            return array('status' => 204,'message' => 'Username not found.');
        } else {
            $hashed_password = $q->password;
            $id              = $q->user_id;
            if (hash_equals($hashed_password, md5(crypt($password, $this->config->item('salt'))))) {
                $last_login = date('Y-m-d H:i:s');
                $token = crypt(substr( md5(rand()), 0, 7),'1234');
                $expired_at = date("Y-m-d H:i:s", strtotime('+1 hour'));
                $this->db->trans_start();
                $this->db->where('user_id',$id)->update('users',array('last_login' => $last_login));
                $this->db->insert('users_authentication',array('users_id' => $id,'token' => $token,'expired_at' => $expired_at));
                if ($this->db->trans_status() === FALSE){
                    $this->db->trans_rollback();
                    return array('status' => 500,'message' => 'Internal server error.');
                } else {
                    $q  = $this->db->select('password,user_id,email,fname,lname,role_id,branch_id,dept_id,user_image')->from('users')->where('email',$username)->get()->row();
                    $session_data = array(
                    'email' => $q->email,
                    'branch_id' => $q->branch_id,
                    'dept_id' => $q->dept_id,
                    'image' => $q->user_image,
                    'user_name' => $q->fname.' '.$q->lname,
                    'role_id' => $q->role_id,    
                    'user_id' => $q->user_id, 
                    'status' => 200,
                    'id' => $q->user_id, 
                    'token' => $token,
                    );

                    $this->session->set_userdata($session_data); 
                    $this->db->trans_commit();
                    return $session_data;
                }
            } else {
                return array('status' => 204,'message' => 'Wrong password.');
            }
        }
    }

    public function logout()
    {
        $users_id  = $this->input->get_request_header('User-ID', TRUE);
        $token     = $this->input->get_request_header('Authorization', TRUE);
        $this->db->where('users_id',$users_id)->where('token',$token)->delete('users_authentication');
        return array('status' => 200,'message' => 'Successfully logout.');
    }

    public function auth()
    {
         $users_id  = $this->input->get_request_header('User-ID', TRUE);
        $token     = $this->input->get_request_header('Authorization', TRUE);
        $q  = $this->db->select('expired_at')->from('users_authentication')->where('users_id',$users_id)->where('token',$token)->get()->row();
        if($q == ""){
            return array('status' => 401,'message' => 'Unauthorized.');
        } else {
            if($q->expired_at < date('Y-m-d H:i:s')){
                return array('status' => 401,'message' => 'Your session has been expired.');
            } else {
                $updated_at = date('Y-m-d H:i:s');
                $expired_at = date("Y-m-d H:i:s", strtotime('+1 hour'));
                $this->db->where('users_id',$users_id)->where('token',$token)->update('users_authentication',array('expired_at' => $expired_at,'updated_at' => $updated_at));
                return array('status' => 200,'message' => 'Authorized.');
            }
        }
    }

}
<?php
    class Forgot_Password extends CI_Controller
    {
        public function __construct()
        {
            /*call CodeIgniter's default Constructor*/
            parent::__construct();
            /*load database libray manually*/
            $this->load->library('email');
            $this->load->helper(array('cookie', 'url'));
            $this->load->model('Forgot_Password_model','FP');
        }


      public function index()
       {
        $this->load->view('forgot_password_view');
       }

        public function forgot_passwd(){
            $data=$this->FP->checkEmail();

            echo json_encode($data);
        }


         public function send_email()
    {

        $result=$this->FP->get_data();

         $data = array(
        'subject' => "Password reset request",
        'from_name' => "Embassy Golf Links -EGL",
        'to_mail' => $result->email,
        'to_name' => $result->fname,
        'id' => $result->user_id,
        'from_mail' => 'mentrictech@gmail.com',

        );

        $this->load->library('email');

        $this->email->from($data['from_mail'], $data['from_name']);
        $this->email->to($data['to_mail']);

        $this->email->subject($data['subject']);
         $mail_message = 'Dear ' . $data['to_name'] . ',' . "\r\n";
       $mail_message .= 'Thanks for contacting regarding to forgot password,."\r\n" Click On Link And Reset Password:."\r\n"<a href="http://173.249.41.211/workOrder/Forgot_Password/update_password/'.$data['id'].'">."\r\n"Reset Password</a>'."\r\n";
       $mail_message .= 'Please Update your password '. "\r\n";
       $mail_message .= 'Thanks & Regards'. "\r\n";
        $this->email->message($mail_message);

        //$this->email->send();
           if ($this->email->send()) {
            $result = 'Your Email has successfully been sent.';
        } else {
            $result = $this->email->print_debugger();
        }
       /* return $result;*/
        echo json_encode($result);
    }

       /* public   function otp_verify()
        {

            $rno= get_cookie('otp');
            $urno=$_POST['otp'];
            if(!strcmp($rno,$urno))
            {

                if(isset($_POST['resend']))

                {
                    $message="<p class='text-success'>Sucessfully send OTP to your mail.</p>";
                   $this->email->from('otp@studentstutorial.com', 'Your Name');
                    $this->email->to($this->input->post('email'));
                    $this->email->cc('mail@example.com');
                    $this->email->subject('Email Test');
                    $this->email->message('urlencode("otp number.".$rndno)');
                    $this->email->send();

                    $message="<p class='w3-text-green w3-center'><b>Sucessfully resend OTP to your mail.</b></p>";
                }
                 echo 'true';
            }
            else
            {

                echo 'false';

            }
        }
*/

  public function update_password()
{
    $user_id = $this->uri->segment(3);
    $data=array(
        'user_id' => $user_id
    );
    $this->load->view('update_password_view',$data);
}
  public function change_password()
  {

    $data=$this->FP->change_password();
    echo json_encode($data);
  }


    }



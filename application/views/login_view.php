<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>EAM - WonderLa</title>
        <!-- plugins:css -->
        <link rel="stylesheet" href="<?php echo base_url()?>application/assets/vendors/mdi/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="<?php echo base_url()?>application/assets/vendors/css/vendor.bundle.base.css">
        <!-- endinject -->
        <!-- Plugin css for this page -->
        <!-- End plugin css for this page -->
        <!-- inject:css -->
        <!-- endinject -->
        <!-- Layout styles -->
        <link rel="stylesheet" href="<?php echo base_url()?>application/assets/css/demo_1/style.css">
        <link rel="stylesheet" href="<?php echo base_url(); ?>application/assets/nprogress/nprogress.css">
        <link rel="stylesheet" href="<?php echo base_url(); ?>application/assets/toastr/toastr.min.css">
        <!-- End layout styles -->
        <link rel="shortcut icon" href="<?php echo base_url()?>application/assets/images/favicon.png" />
        <script type="text/javascript">
            var base_url = "<?php echo base_url();?>"
            var api_base_url  = '<?= $this->config->item('api_base_url');?>';
        </script>
    </head>
    <body>
        <div class="container-scroller">
            <div class="container-fluid page-body-wrapper full-page-wrapper">
                <div class="content-wrapper d-flex align-items-center auth">
                    <div class="row flex-grow">
                        <div class="col-lg-4 mx-auto">
                            <div class="auth-form-light text-left p-5">
                                <div class="brand-logo">
                                    <img src="<?php echo base_url()?>application/assets/images/logo.png">
                                </div>
                                <h6 class="font-weight-light">Sign in to continue.</h6>
                                <?php $attributes = array('class' => 'pt-3', 'id' => 'login_form', 'name' => "login_form");
                                echo form_open('login/login',$attributes, ['csrf_id' => 'csrf_eam']); ?>
                                     <div class="form-group">
                                        <input type="email" class="form-control form-control-lg" id="email" name="email" placeholder="Username">
                                    </div>
                                    <div class="form-group">
                                        <input type="password" class="form-control form-control-lg" name="password" id="password" placeholder="Password">
                                    </div>
                                    <div class="mt-3">
                                        <button type="submit" class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" id="btn_login" name="btn_login">Login</button>
                                    </div>
                                <?php echo form_close() ?>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- content-wrapper ends -->
            </div>
            <!-- page-body-wrapper ends -->
        </div>
        <!-- container-scroller -->
        <!-- plugins:js -->
        <script src="<?php echo base_url()?>application/assets/vendors/js/vendor.bundle.base.js"></script>
        <!-- endinject -->
        <!-- Plugin js for this page -->
        <!-- End plugin js for this page -->
        <script src="<?php echo base_url()?>application/assets/js/jquery.min.js"></script>
        <script type="text/javascript" src="<?php echo base_url()?>application/assets/js/jquery.validate.js"></script>
        <script type="text/javascript" src="<?php echo base_url()?>application/assets/toastr/toastr.min.js"></script>
        <script type="text/javascript" src="<?php echo base_url()?>application/assets/nprogress/nprogress.js"></script>
        <script type="text/javascript" src="<?php echo base_url()?>application/assets/admin/login.js"></script>
    </body> 
</html>

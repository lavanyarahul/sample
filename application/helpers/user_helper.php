<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function user_status(){

    $ci =& get_instance();

    $user_email = $ci->session->userdata('user_email');
    $user_id = $ci->session->userdata('user_id');

    $condition = array(
    'user_id' => $user_id,
    'email' => $user_email,
    );

    $ci->db->select('status');
    $ci->db->from('users');
    $ci->db->where($condition);
    $query = $ci->db->get();

    if ($query->num_rows()> 0) {
        return $query->row()->status;
    } else {
        return 0;
    }
}

function getNotificationCount(){
    $ci =& get_instance();

    $SQL =  'SELECT IFNULL(SUM(pr), 0 ) AS pr,IFNULL(SUM(wo), 0 ) AS wo  FROM ( select
    (case when not_type IN (1,3,5) then COUNT(not_id) ELSE 0 END ) AS pr,
    (case when not_type IN (2,4) then COUNT(not_id) ELSE 0 END ) AS wo
    from notification WHERE `not_status` = 1 AND `not_to` = '.$ci->session->userdata('user_id').'
    GROUP BY not_type ) TBL' ;
    return $query = $ci->db->query($SQL)->row();
}

function getNotification(){
    $ci =& get_instance();

    $ci->db->select('notification.*,fname,lname');
    $ci->db->from('notification');
    $ci->db->join('users','users.user_id = notification.not_from','left');
    $ci->db->where('not_to', $ci->session->userdata('user_id'));
    $ci->db->where('not_status', 1);
    $ci->db->order_by('notification.created_datetime','DESC');
    $query= $ci->db->get();
    $ci->db->last_query();
    return $query;
}

function updateNotification($type){

    $ci =& get_instance();

    $ci->db->set('not_status', 0);
    $ci->db->where('not_type', $type);
    $ci->db->where('not_to', $ci->session->userdata('user_id'));
    $result=$ci->db->update('notification');
    return $result;
}

function getNotTo($role_id){

    $ci =& get_instance();

    $ci->db->select('user_id');
    $ci->db->from('users');
    $ci->db->where('role_id',$role_id);
    $ci->db->limit(1);
    $query = $ci->db->get();
    return $query->row()->user_id;
}

function sendNotification($noti_data){
    $ci =& get_instance();
    $ci->db->insert('notification',$noti_data);

}
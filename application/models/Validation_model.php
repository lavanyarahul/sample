<?php class Validation_model extends CI_Model{

	public function __construct() {        
        parent::__construct();
    }
	
    public function addDuplicate(){  

        $data_add = $this->input->post('data_add');        
        $colum_name = $this->input->post('colum_name');        
        $table_name = $this->input->post('table_name');        

        $condition = array(              
            'status' => 1,            
            $colum_name => $data_add,           
        );        

        $this->db->select('*');        
        $this->db->from($table_name);              
        $this->db->where($condition);                                   
        $query = $this->db->get();           
        if($query->num_rows()> 0){            
            return false;        
        }else{            
            return true;        
        }    
    }

    public function EditDuplicate(){
        
        $data_edit = $this->input->post('data_edit');
        $colum_name = $this->input->post('colum_name');
         $id = $this->input->post('id');
        $table_name = $this->input->post('table_name');        
        $table_id = $this->input->post('table_id'); 

        $condition = array(              
            'status' => 1,            
            $colum_name => $data_edit,           
        );        
        
        $this->db->select('*');        
        $this->db->from($table_name);              
        $this->db->where($condition);                                   
        $query = $this->db->get();           
          $this->db->last_query();           
        if($query->num_rows()> 0){            
            if($query->row()->$table_id==$id){                
                return true;            
            }else{                
                return false;            
            }        
        }else{            
            return true;        
        }    
    }


    
}
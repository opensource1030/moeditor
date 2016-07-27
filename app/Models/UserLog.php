<?php namespace MobileOptin\Models;

use Illuminate\Database\Eloquent\Model;
use MobileOptin\Models\User;
class UserLog extends Model {

    protected $fillable = array('user_id', 'user_info', 'ip');
	public function users(){
        return $this->belongsTo('MobileOptin\Models\User','user_id','id');
    }

}

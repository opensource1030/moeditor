<?php
/**
 *
 * User: Damir djikic
 * damir@cod3.me , ddjikic@gmail.com
 * website www.cod3.me
 * Date: 5/11/15
 * Time: 9:53 PM
 */
namespace MobileOptin\Models;

use Illuminate\Database\Eloquent\Model;
use MobileOptin\Models\UserLog;
class UserOwner extends Model
{
    protected $table = 'user_owner';
    public $timestamps = true;
    protected $primaryKey = 'id';

    public function logs()
    {
        return $this->hasMany('MobileOptin\Models\UserLog','user_id');
    }

}





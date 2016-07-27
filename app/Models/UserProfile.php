<?php

namespace MobileOptin\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{


    protected $table = 'user_profile';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = [ 'user_id', 'max_campaigns', 'split_testing', 'redirect_page', 'embed', 'hosted','analytics_retargeting','package_id' ];

    public function user()
    {
        return $this->belongsTo( 'MobileOptin\Models\User' );
    }
        public function package()
    {
        return $this->belongsTo( 'MobileOptin\Models\Package' );
    }
}





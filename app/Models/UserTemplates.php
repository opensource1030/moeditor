<?php

namespace MobileOptin\Models;

use Illuminate\Database\Eloquent\Model;

class UserTemplates extends Model
{


    protected $table = 'user_templates';
    public $timestamps = true;
    protected $primaryKey = 'id';

    protected $fillable = [
                            'contact_type',
                            'integration_id',
                            'return_redirect',
                            'redirect_after',
                            'email_subject',
                            'notification_email',
                            'email_message',
                            'affect_percentile',
                            'contact_us',
                            'privacy',
                            'terms',
                            'campaign_id',
                            'body',
                            'name',
                            'original_template_id',
                            'user_id',
                                                        
                        ];

    public function getBodyAttribute()
    {
        // dump($this->attributes['body']);
        // dd(htmlspecialchars_decode(trim($this->attributes['body'])));
        // dd($this->attributes['body']);
        return $this->attributes['body'];
        return htmlspecialchars_decode(trim($this->attributes['body']));
    }


    public function user()
    {
        return $this->belongsTo( 'MobileOptin\Models\User' );
    }

    public function campaign()
    {
        return $this->belongsTo( 'MobileOptin\Models\Campaigns' );
    }

    public function org_template()
    {
        return $this->belongsTo( 'MobileOptin\Models\CampaignsTemplates', 'original_template_id', 'id' );

    }

    public static function cleanOld()
    {
        static::where( 'campaign_id', '=', 0 )->where( 'created_at', '<', strtotime( '-3days' ) )->limit( 20 )->delete();

    }

    public function integrations_user()
    {
        return $this->hasOne( 'MobileOptin\Models\IntegrationsUser', 'id', 'contact_type');
    }
}
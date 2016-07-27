<?php

namespace MobileOptin\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignSeo extends Model
{
    protected $table = 'campaign_seo';
    protected $fillable = [
                            'title',
                            'author',
                            'keywords',
                            'description',
                            'campaign_id',
                          ];

}





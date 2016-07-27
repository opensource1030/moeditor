<?php

namespace MobileOptin\Http\Controllers;

//use Input;
use Clockwork\Clockwork;
use Htmldom;
use Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use MobileOptin\Models\Campaigns;
use MobileOptin\Models\CampaignStats;
use MobileOptin\Models\CampaignsTemplates;
use MobileOptin\Models\SplitTestingStats;
use MobileOptin\Models\TemplatesGroups;
use MobileOptin\Models\User;
use MobileOptin\Models\UserAllowedCampaigns;
use MobileOptin\Models\UserProfile;
use MobileOptin\Models\UserTemplates;
use MyProject\Proxies\__CG__\stdClass;
use PhpSpec\Exception\Exception;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\DB;
use Illuminate\Html\FormBuilder;
use Illuminate\Support\Facades\File;

class CampaignsController extends Controller {
    /*
      |--------------------------------------------------------------------------
      | Home Controller
      |--------------------------------------------------------------------------
      |
      | This controller renders your application's "dashboard" for users that
      | are authenticated. Of course, you are free to change or remove the
      | controller as you wish. It is just here to get your app started!
      |
     */

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    function __construct() {
        parent::__construct();
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard to the user.
     *
     * @return Response
     */
    
    public function getVariationV2($campaign_id, $variation_id)
    {
        $variation = UserTemplates::where('campaign_id', $campaign_id)->where('id', $variation_id)->first();
        if(!$variation) {
            return response()->json(['status' => 'error', 'message' => 'Variation not found.'], 404);
        }
        $variation->integrations = null;
        if($variation->contact_type != 0) {
            $integrations = $this->camplist($variation->contact_type, false);
            $variation->integrations = $integrations;
        }
        return response()->json(['status' => 'success', 'resource' => $variation]);
    }

    public function uploadImageV2(Request $request)
    {
        $validator = \Validator::make($request->only(['image']), [
                    'image' => 'required|mimes:jpeg,bmp,png,gif,jpg',
        ]);
        if($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'You should upload image file'], 422);
        }
        $file = $request->file('image');
        $destination = public_path('v2/images/uploads');
        
        $file_name = 'temp_uploaded_' . str_random(32). '-' . date('Y_m_d_H_i_s') .'.'.$file->getClientOriginalExtension();

        
        if($file->move($destination, $file_name)){
            return response()->json(['status' => 'success', 'filename' => $file_name]);
        }
        return response()->json(['status' => 'error', 'message' => 'Something went wrong']);
    }

    public function previewTemplateV2(Request $request)
    {
        $template_content = $request->input('template_content', '');
        $template_content = trim($template_content);
        $res = $this->getV2TemplateCarcase($template_content);
        return response()->json(['status' => 'success', 'body' => $res]);
    }

    public function previewV2()
    {
        return view('v2.loading');
    }
    
    public function saveSeoV2(Request $request) 
    {
        $campaign_id = $request->get('campaign_id');
        $seo_data = $request->get('seo');
        $campaign = Campaigns::find($campaign_id);
        if(!$campaign) {
            return response()->json(['status' => 'error', 'message' => 'Error, campaign not found'], 404);
        }
        if($campaign->seo){
            $campaign->seo->update($seo_data);
        } else {
            $campaign->seo->create($seo_data);
        }
        return response()->json(['status' => 'success', 'message' => 'Seo was saved']);
    }

    public function editCampaignV2($id)
    {
        $CId = $id;
        $data = array();
        \SEOMeta::setTitle('Add - Campaigns ');
        $user_id = \Auth::user()->getOwner() ? \Auth::user()->getOwner() : \Auth::id();
        session_start();
        $_SESSION["userID"] = '/public/upload/user_' . $user_id;

        $rtg = Auth::user()->allowed_groups()->with('tplgroups.templates')->get();

        $availabl_template_groups = [];

        $templates_groups = [];
        foreach ($rtg as $a) {
            foreach ($a->tplgroups as $b) {
                $availabl_template_groups[] = $b->id;
                foreach ($b->templates as $tmp) {
                    if ($tmp->active == 1) {
                        $templates_groups[$b->name][] = $tmp;
                    }
                }
            }
        }
        $data['templates'] = $templates_groups;
        $dis_templates_groups = [];
//        if ( !empty( $availabl_template_groups ) ) {
//            $ds_templategroups = TemplatesGroups::whereNotIn( 'id', $availabl_template_groups )->with( 'templates' )->get();
//
//
//            foreach ( $ds_templategroups as $b ) {
//
//
//                foreach ( $b->templates as $tmp ) {
//                    if ( $tmp->active == 1 ) {
//                        $dis_templates_groups[ $b->name ][ ] = $tmp;
//                    }
//                }
//            }
//        }
        $data['integrations'] = [];
        $data['templates_disable'] = $dis_templates_groups;

        try {
            if (Auth::user()->getOwner() !== false) {
                $edior_id = Auth::user()->getOwner();
            } else {
                $edior_id = Auth::id();
            }
            $data['can_analytics_retargeting'] = Auth::user()->getProfileOption('analytics_retargeting') ? '' : 'disabled="disabled"';
            $campaign = Campaigns::with('template', 'template.org_template')->where('user_id', '=', $edior_id)->where('id', '=', $CId)->firstOrFail();
            $data['can_redirect'] = Auth::user()->getProfileOption('redirect_page') ? '' : 'disabled="disabled"';
            $data['campaign'] = Campaigns::with('template', 'template.org_template')->where('user_id', '=', $edior_id)->where('id', '=', $CId)->firstOrFail();
            $data['domains'] = [0 => 'app.mobileoptin.com'];
            $data['domains'] += \MobileOptin\Models\Domains::where('user_id', '=', $edior_id)->where('status', '=', '2')->where('active', '=', '1')->lists('name', 'id');
            $data['ao_clicks'] = SplitTestingStats::where('campaign_id', '=', intval($CId))->where('event', '=', 'ao_navigate')->count();
            // dd();
            $template = $campaign->template()->first();
            $data['template'] = $template;
            $data['seo'] = $campaign->seo;
            $data['original_template_id'] = 0;
            $data['variations'] = $campaign->template;
            // dd($template->contact_type);
            if($template->contact_type > 0) {
                $integrations = $this->camplist($template->contact_type, false);
                $data['integrations'] = $integrations;
            }
            // dd($template);
        } catch (\Exception $e) {
            // dd($e);
            return redirect()->route('campaigns')->withError($e . 'Campaign not found or you do not have permissions');
        }

        $data['contact_types'] = [0=>'Manual'];
        $data['contact_types'] += \MobileOptin\Models\IntegrationsUser::where('user_id', $edior_id)->lists('name', 'id');
#dd($data['contact_types']);
        $data['user_integrations'] = \MobileOptin\Models\IntegrationsUser::where('user_id', $edior_id)->get();
        // dd($data['campaign']);
        // dd($data['user_integrations']);
        return view('v2.campaigns.add', $data);
        return view('campaigns.add_edit', $data);
    }

    public function getAllVariationsV2($campaign_id)
    {
        $campaign = Campaigns::find($campaign_id);
        if(!$campaign) {
            return response()->json(['status' => 'error', 'message' => 'Campaign not found']);
        }
        return response()->json(['status' => 'success', 'resource' => $campaign->template]);
    }

    public function deleteVariationV2(Request $request) 
    {
        // dd($request->all());
        $template_id = $request->input('template_id');
        $campaign_id = $request->input('campaign_id');
        $campaign = Campaigns::find($campaign_id);
        if(!$campaign) {
            return response()->json(['status' => 'error', 'message' => 'Campaign not found'], 404);
        }
        if($campaign->template()->count() === 1) {
            return response()->json(['status' => 'error', 'message' => 'The minimum count of saved variations is 1'], 422);
        }
        $template = $campaign->template()->where('id', $template_id)->first();
        if(!$template) {
            return response()->json(['status' => 'error', 'message' => 'Variation not found'], 404);
        }
        $traffic_allocation = $template->affect_percentile;
        // dd($traffic_allocation);
        $templates = $campaign->template()->where('id', '!=', $template_id)->get();

        if($traffic_allocation > 0) {
            // dd($templates);
            $count_of_templates = count($templates);
            $part = $traffic_allocation / $count_of_templates;
            $part = (int)floor($part);
            $remain = $traffic_allocation % $count_of_templates;
            $i = 0;
            foreach ($templates as $value) {
                $current_allocation = $value->affect_percentile;
                if($i + 1 == count($count_of_templates)) {
                    $allocation = $part + $remain + $current_allocation;
                    $value->update(['affect_percentile' => $allocation]);
                } else {
                    $allocation = $part + $current_allocation;
                    $value->update(['affect_percentile' => $allocation]);
                }
                $i++;
            }
        }
        if(count($templates) == 1) {
            $campaign->enable_optimization = 0;
            $campaign->ao_type = '';
            $campaign->save();
        }
        $this->deleteTemplateImages($template->body);
        $template->delete();
        return response()->json(['status' => 'success', 'resource' => $templates]);

    }

    public function seoImageV2(Request $request)
    {
        // dd($request->all());
        // dd();
        $campaign_id = $request->get('campaign_id');
        if(!$campaign_id || $campaign_id == 0) {
            return response()->json(['status' => 'error', 'message' => 'First you need to create campaign'], 422);
        }
        $validator = \Validator::make($request->only(['image']), [
                    'image' => 'required|mimes:jpeg,bmp,png,gif,jpg',
        ]);
        if($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'You should upload image file'], 422);
        }
        $campaign = Campaigns::find($campaign_id);
        // dd($campaign->seo);
        if(!$campaign) {
            return response()->json(['status' => 'error', 'message' => 'Campaign not found']);
        }
        if($campaign->seo) {
            $campaign->seo()->create([
                'title' => '',
                'author' => '',
                'keywords' => '',
                'description' => '',
                'seo_image' => null,
                ]);
        }
        $file = $request->file('image');
        $destination = public_path('v2/images/uploads');
        $file_name = str_random(32).'.'.$file->getClientOriginalExtension();
        if($campaign->seo->seo_image) {
            File::delete($destination.'/'.$campaign->seo->seo_image);
        }
        
        if($file->move($destination, $file_name)){
            $seo = $campaign->seo;
            $seo->seo_image = $file_name;
            $seo->save();
            return response()->json(['status' => 'success', 'filename' => $file_name]);
        }
        return response()->json(['status' => 'error', 'message' => 'Error on image upload process']);
    }

    public function removeSeoImageV2($campaign_id) 
    {
        $campaign = Campaigns::find($campaign_id);
        if($campaign && $campaign->seo && $campaign->seo->seo_image) {
            $seo = $campaign->seo;
            File::delete(public_path('v2/images/uploads/'.$seo->seo_image));
            $seo->seo_image = null;
            $seo->save();
        }
        return response()->json(['status' => 'success']);
    }
    
    public function createCampaignV2(Request $request)
    {
        // dd($request->all());
        // $r = $request->input('id');
        // dd($r);
        // dd($request->input('variation.template_name'));
        $campaign_validator = \Validator::make(\Input::only('id', 'name', 'slug'), [
                    // 'id' => 'required|integer',
                    'name' => 'required',
                    'slug' => 'required',
                    // 'slukg' => 'required',
        ]);
        if ($campaign_validator->fails()) {
            // The given data did not pass validation
            return response()->json( ['type' => 'campaign', 'error' => $campaign_validator->errors()->all()], 422);
        }
        $variation = $request->get('variation', null);
        $variation_rules = [
                        'name' => 'required',
                        'email_message' => 'required',
                        'email_subject' => 'required',
                        'redirect_after' => 'required',
                    ];
        if($variation['contact_type'] == 0) {
            $variation_rules['notification_email'] = 'required|email';
        }
        $variation_validator = \Validator::make($variation, $variation_rules);
        if ($variation_validator->fails()) {
            // The given data did not pass validation
            return response()->json( ['type' => 'variation', 'error' => $variation_validator->errors()->all()], 422);
        }
        $campaign_id = $request->input('id');
        if($campaign_id == 0) {
           if(!isset($variation['body']) || !$variation['body'] || $variation['body'] == '') {
                return response()->json( ['type' => 'template', 'error' => ['Template was empty!']], 422);
            } 
        }
        
      ///////////////////////////////
            
        $user_id = Auth::user()->getOwner() ? Auth::user()->getOwner() : Auth::id();
        // dd($campaign_id, $user_id, $request->all());

        if ($campaign_id > 0) {
            $new_camp = Campaigns::where('id', '=', $campaign_id)->first();
            if (!$new_camp) {
                return redirect()->back()->withInput()->withError('Campaign not found');
            }
            else {
                $old_optimization = $new_camp->enable_optimization;
            }
        } else {
            $new_camp = new Campaigns();

            $new_camp->user_id = $user_id;
            $old_optimization = 2;
        }

        // dd($new_camp);
        $new_camp->name = $request->input('name');
        $new_camp->slug = str_slug($request->input('slug'));
        $new_camp->domain_id = str_slug($request->input('domain_id'));
        $new_camp->ao_clicks = str_slug(\Input::get('ao_clicks'));
        $new_camp->ao_type= str_slug(\Input::get('ao_type'));
        $new_camp->ao_threshold = str_slug(\Input::get('ao_threshold'));
        $new_camp->enable_optimization = $request->input('enable_optimization', 0);
        $new_camp->enable_retargeting = $request->input('enable_retargeting', 0);
        $new_camp->enable_return_redirect = $request->input('enable_return_redirect', 0);
        $new_camp->analitics_and_retargeting = $request->input('analitics_and_retargeting', '');
        $new_camp->redirect_return_after = $request->input('redirect_return_after', 0);
        $new_camp->redirect_return_url = $request->input('redirect_return_url', 0);
        $new_camp->active = 1;
        $new_camp->v2 = true;

        $new_camp->save();
        if($campaign_id == 0) {
            $seo = $new_camp->seo()->create($request->get('seo'));
            // $template = $new_camp->template()->create($request->get('variation'));
            $variation = $request->get('variation');
            $template = new UserTemplates;
            $template->campaign_id = $new_camp->id;
            // $template->terms = $variation['terms'];
            $template->terms = '';
            // $template->privacy = $variation['privacy'];
            $template->privacy = '';
            // $template->contact_us = $variation['contact_us'];
            $template->contact_us = '';
            $template->return_redirect = '';
            $template->notification_email = isset($variation['notification_email'])?$variation['notification_email']:'';
            $template->redirect_after = $variation['redirect_after'];
            $template->email_subject = $variation['email_subject'];
            $template->contact_type = $variation['contact_type'];
            $template->integration_id = isset($variation['integration_id'])?$variation['integration_id']:null;
            $template->email_message = $variation['email_message'];
            $template->name = $variation['name'];
            $template->body = $this->processTemplateImages(trim($variation['body']), null);;
            $template->affect_percentile = 100;

            $template->save();
            $resource = ['campaign' => $new_camp, 'template' => $template];
        } else {
            $resource = $new_camp;
        }
        if($new_camp->enable_optimization != $old_optimization || $new_camp->enable_optimization == 0){
            $deleteStats = SplitTestingStats::where('campaign_id', '=', $new_camp->id)
                                            ->whereIn('event', array('ao_page_open', 'ao_navigate', 'ao_optin', 'ao_pixel'))
                                            ->delete();
        }

        if (Auth::user()->getOwner() !== false) {

            $ua = new UserAllowedCampaigns();
            $ua->user_id = Auth::id();
            $ua->campaign_id = $new_camp->id;
            $ua->save();
        }
        return response()->json(['status' => 'success', 'resource' => $resource]);
    }

    public function canUseOptimisationV2($campaign_id)
    {
        $campaign = Campaigns::find($campaign_id);
        if($campaign->template()->count() >= 2) {
            return response()->json(['true']);
        }
        return response()->json(['false']);
    }

    public function saveVariationV2(Request $request)
    {
        ini_set("pcre.backtrack_limit", 1000000000000);
        $attributes = $request->get('attributes');
        $variation_rules = [
                        'name' => 'required',
                        'email_message' => 'required',
                        'email_subject' => 'required',
                        'redirect_after' => 'required',
                    ];
        if($attributes['contact_type'] == 0) {
            $variation_rules['notification_email'] = 'required|email';
        }
        $validator = \Validator::make($attributes, $variation_rules);
        if($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Please fill variation fields'], 422);
        }
        $template_content = $request->get('template_content', '');
        if($template_content == '') {
            return response()->json(['status' => 'error', 'message' => 'Template content was empty'], 422);
        }

        $campaign_id = $request->get('campaign_id');
        $variation_id = $request->get('variation_id');
        
        $traffic_allocation = $request->get('traffic_allocation');
        // dd($traffic_allocation);
        $campaign = Campaigns::find($campaign_id);
        $percentage_result = 0;
        array_walk($traffic_allocation, function(&$value) use(&$percentage_result){
            $value = (int)$value;
            $percentage_result += $value;
        });
        if(!$campaign) {
            return response()->json(['status' => 'error', 'message' => 'Campaign not found.'], 404);
        }
        if($percentage_result > 100) {
            return response()->json(['status' => 'error', 'message' => 'Traffic allocation sum was greater than 100%'], 422);
        }
        if($percentage_result < 98) {
            return response()->json(['status' => 'error', 'message' => 'Traffic allocation sum was smaller than 100%'], 422);
        }
        $percentage_result = 0;
        $i = 0;
        $previous_key = '';
        foreach ($traffic_allocation as $key => $value) {
            if($i + 1 == count($traffic_allocation) && $value == 0) {
                $traffic_allocation[$previous_key] = $traffic_allocation[$previous_key] + 100 - $percentage_result;
                $value = 100 - $percentage_result;
            } elseif($i + 1 == count($traffic_allocation) ) {
                $traffic_allocation[$key] = 100 - $percentage_result;
                $value = 100 - $percentage_result;
            }
            $percentage_result += $value;
            $previous_key = $key;
            $i++;
        }
        // dd($percentage_result, $traffic_allocation);
        
        $insertable = [
                'terms' => isset($attributes['terms'])?$attributes['terms']:'',
                'privacy' => isset($attributes['privacy'])?$attributes['privacy']:'',
                'contact_us' => isset($attributes['contact_us'])?$attributes['contact_us']:'',
                'contact_type' => isset($attributes['contact_type'])?$attributes['contact_type']:0,
                'return_redirect' => isset($attributes['return_redirect'])?$attributes['return_redirect']:'',
                'notification_email' => isset($attributes['notification_email'])?$attributes['notification_email']:'',
                'redirect_after' => isset($attributes['redirect_after'])?$attributes['redirect_after']:'',
                'email_subject' => isset($attributes['email_subject'])?$attributes['email_subject']:'',
                'integration_id' => isset($attributes['integration_id'])?$attributes['integration_id']:'',
                'email_message' => isset($attributes['email_message'])?$attributes['email_message']:'',
                'name' => isset($attributes['name'])?$attributes['name']:'',
                'body' => $template_content,
            ];
        $status = 200;
        
        // dd($request->all(), $variation);
        if($variation_id == 0) {
            $insertable['affect_percentile'] = $traffic_allocation['0'];
            unset($traffic_allocation['0']);
            $insertable['body'] = $this->processTemplateImages($template_content, null);
            $template = $campaign->template()->create($insertable);
            $result = ['status' => 'success', 'resource' => $template];
        } else {
            $variation = $campaign->template()->where('id', $variation_id)->first();
            $template = $campaign->template()->where('id', $key)->first();
            $insertable['body'] = $this->processTemplateImages($template_content, $variation->body);
            if(!$variation) {
                $result = ['status' => 'error', 'message' => 'Variation not found'];
                $status = 404;
            } else {
                $variation->update($insertable);
                $result = ['status' => 'success', 'resource' => $variation];
            }
        }
        foreach ($traffic_allocation as $key => $value) {
            $template = $campaign->template()->where('id', $key)->first();
            if($template) {
                $template->update(['affect_percentile' => $value]);
            }
        }
        return response()->json($result, $status);
    }

    public function processTemplateImages($body, $old = null)
    {
        // dd();
        $body = trim($body);
        $result = [];
        if (preg_match_all('%.*?/?([^/]+?(\.gif|\.png|\.jpg))%s', $body, $result_arr)) {
              $result = $result_arr[1];
        }
        // dd($result, $body);
        $renamable = [];
        $for_deletion = [];    
        if(!empty($result)) {
            foreach ($result as $value) {
                // dd();
                if(($pos = strpos( $value, 'temp')) !== false) {
                    $renamable[$value] = substr($value, $pos + 5);
                } 
                
            }
        }
        if($old) {
            $old = trim($old);
            $result_old = [];
            if (preg_match_all('%.*?/?([^/]+?(\.gif|\.png|\.jpg))%s', $old, $result_arr)) {
                  $result_old = $result_arr[1];
            }  
            if(!empty($result_old)) {
                foreach ($result_old as $value) {
                    // dd();
                    if(($pos = strpos( $body, $value)) === false) {
                        $for_deletion[] = $value;
                    } 
                    
                }
            }
        }
        // dd('end');
        // dd($for_deletion);
        foreach ($renamable as $key => $value) {
            // dd(str_replace($key, $value, $body));
            // dd(strpos($body, $key));
            try {
                File::move(public_path('v2/images/uploads/'.$key), public_path('v2/images/uploads/'.$value));
            } catch (\Exception $e) {
                
            }
            $body = str_replace($key, $value, $body);
            // if() {
                
            // }
        }
        foreach ($for_deletion as $key => $value) {
            File::delete(public_path('v2/images/uploads/'.$value));
        }
        return $body;
    }

    public function deleteTemplateImages($template)
    {
        $template = trim($template);
        $result = [];
        if (preg_match_all('%.*?/?([^/]+?(\.gif|\.png|\.jpg))%s', $template, $result_arr)) {
              $result = $result_arr[1];
        }
        foreach ($result as $value) {
            File::delete(public_path('v2/images/uploads/'.$value));
        }
    }

    public function index() {


        \SEOMeta::setTitle('Campaigns - page ' . ( \Input::get('page') ? \Input::get('page') : 1 ));

        \SEOMeta::setDescription('meta desc');
        \SEOMeta::addKeyword([ 'key1', 'key2', 'key3']);

        $data['has_embed'] = Auth::user()->getProfileOption('embed');
        $data['has_hosted'] = Auth::user()->getProfileOption('hosted');
        // dd($data);

        $user_id = Auth::user()->getOwner() ? Auth::user()->getOwner() : Auth::id();
        
        if($user_id == Auth::id()){
        	$data['campaigns'] = Campaigns::where('user_id', '=', $user_id)->with('template')->paginate(10)->setPath('campaigns');
        }else{
        	
			$data['campaigns'] = Campaigns::with('template')->whereHas('assigned', function ( $query ) {
					$query->where('user_id', Auth::id());
				})->paginate(10)->setPath('campaigns');
        }
        

        $cids = [];

        foreach ($data['campaigns'] as $c) {
            $cids[] = $c->id;
        }

        $data['splitTestStats'] = SplitTestingStats::getMultiBasicInfo($cids, 'now', 'now');

        //lotery to delete old templates
        UserTemplates::cleanOld();


        //        \Clockwork::info( $splt );
        return view('campaigns.list', $data);
    }

    public function add(Request $request) 
    {
        // return view('v2.campaigns.add');
        if (Auth::user()->getOwner() == false) {
            $campaign_limit = Auth::user()->campaignLimit();
        } else {

            $own_profile = UserProfile::where('user_id', '=', Auth::user()->getOwner())->first();
            if ($own_profile && $own_profile->package_id != 0) {
                $max_c = $own_profile->package->max_campaigns;
            } else {
                $max_c = $own_profile->max_campaigns;
            }

            $campaign_limit = Campaigns::where('user_id', '=', Auth::user()->getOwner())->count() < $max_c;
        }

        $user_id = \Auth::user()->getOwner() ? \Auth::user()->getOwner() : \Auth::id();
        session_start();
        $_SESSION["userID"] = '/public/upload/user_' . $user_id;

        if ($campaign_limit) {

            $data = array();
            \SEOMeta::setTitle('Add - Campaigns ');
            \DB::enableQueryLog();
            $rtg = Auth::user()->allowed_groups()->with('tplgroups.templates')->get();

            $availabl_template_groups = [];

            $templates_groups = [];
            foreach ($rtg as $a) {
                foreach ($a->tplgroups as $b) {
                    $availabl_template_groups[] = $b->id;
                    foreach ($b->templates as $tmp) {
                        if ($tmp->active == 1) {
                            $templates_groups[$b->name][] = $tmp;
                        }
                    }
                }
            }

            $data['templates'] = $templates_groups;
            $dis_templates_groups = [];
//            if ( !empty( $availabl_template_groups ) ) {
//                $ds_templategroups = TemplatesGroups::whereNotIn( 'id', $availabl_template_groups )->with( 'templates' )->get();
//
//
//                foreach ( $ds_templategroups as $b ) {
//
//                    foreach ( $b->templates as $tmp ) {
//                        if ( $tmp->active == 1 ) {
//                            $dis_templates_groups[ $b->name ][ ] = $tmp;
//                        }
//                    }
//
//                }
//            }
            $data['templates_disable'] = $dis_templates_groups;


            $data['campaign'] = new \stdClass();
            $data['campaign']->id = 0;
            $data['campaign']->name = \Input::old('name');

            $data['campaign']->slug = \Input::old('slug');
            $data['campaign']->user_id = Auth::user()->getOwner() ? Auth::user()->getOwner() : Auth::id();
            $data['campaign']->template = [];
            $data['campaign']->ao_clicks = '';
            $data['campaign']->ao_type = '';
            $data['campaign']->ao_threshold = '';
            $data['campaign']->domain_id = '';
            $data['campaign']->enable_optimization = 0;
            $data['campaign']->enable_retargeting = 0;
            $data['campaign']->enable_return_redirect = 0;
            $data['campaign']->redirect_return_after = 0;
            $data['campaign']->redirect_return_url = '';
            $data['campaign']->analitics_and_retargeting = '';
            /*v2 code*/
            $data['template'] = new \stdClass();
            $data['template']->id = 0;
            $data['template']->page_content = null;
            $data['template']->name = '';
            $data['template']->email_message = '';
            $data['template']->email_subject = '';
            $data['template']->redirect_after = '';
            $data['template']->notification_email = '';
            $data['template']->contact_type = '';
            $data['template']->integration_id = 0;
            $data['template']->contact_us = '';
            $data['template']->privacy = '';
            $data['template']->terms = '';
            
            $data['variations'] = [];

            $data['seo'] = new \stdClass();
            $data['seo']->title = '';
            $data['seo']->author = '';
            $data['seo']->keywords = '';
            $data['seo']->description = '';
            $data['seo']->seo_image = null;




            $old_ids = [];
            $pst = \Input::old('template_id');
            
            if (!empty($pst)) {
                foreach ($pst as $a) {
                    $old_ids[] = $a;
                }
                if (!empty($old_ids)) {
                    $data['campaign']->template = UserTemplates::whereIn('id', $old_ids)->get();
                }
            }
            
            if (Auth::user()->getOwner() !== false) {
                $edior_id = Auth::user()->getOwner();
            } else {
                $edior_id = Auth::id();
            }
            
            $data['integrations'] = [];
            $data['original_template_id'] = 0;
            $data['can_analytics_retargeting'] = Auth::user()->getProfileOption('analytics_retargeting') ? '' : 'disabled="disabled"';
            $data['domains'] = [0 => 'app.mobileoptin.com'];
            $data['domains'] += \MobileOptin\Models\Domains::where('user_id', '=', $edior_id)->where('status', '=', '2')->where('active', '=', '1')->lists('name', 'id');
            $data['can_redirect'] = Auth::user()->getProfileOption('redirect_page') ? '' : 'disabled="disabled"';

            $data['contact_types'] = [0=>'Manual'];
            $data['contact_types'] += \MobileOptin\Models\IntegrationsUser::where('user_id', $edior_id)->lists('name', 'id');

            $data['user_integrations'] = \MobileOptin\Models\IntegrationsUser::where('user_id', $edior_id)->get();
            
            $request->session()->set('_old_input', array());
            // dd($data['user_integrations']);
            return view('v2.campaigns.add', $data);
            return view('campaigns.add_edit', $data);
        }
        return redirect()->route('campaigns')->withError('You have used up all your campaigns !');
    }

    public function edit($CId) {

        $data = array();
        \SEOMeta::setTitle('Add - Campaigns ');

        $user_id = \Auth::user()->getOwner() ? \Auth::user()->getOwner() : \Auth::id();
        session_start();
        $_SESSION["userID"] = '/public/upload/user_' . $user_id;

        $rtg = Auth::user()->allowed_groups()->with('tplgroups.templates')->get();

        $availabl_template_groups = [];

        $templates_groups = [];
        foreach ($rtg as $a) {
            foreach ($a->tplgroups as $b) {
                $availabl_template_groups[] = $b->id;
                foreach ($b->templates as $tmp) {
                    if ($tmp->active == 1) {
                        $templates_groups[$b->name][] = $tmp;
                    }
                }
            }
        }
        $data['templates'] = $templates_groups;
        $dis_templates_groups = [];
//        if ( !empty( $availabl_template_groups ) ) {
//            $ds_templategroups = TemplatesGroups::whereNotIn( 'id', $availabl_template_groups )->with( 'templates' )->get();
//
//
//            foreach ( $ds_templategroups as $b ) {
//
//
//                foreach ( $b->templates as $tmp ) {
//                    if ( $tmp->active == 1 ) {
//                        $dis_templates_groups[ $b->name ][ ] = $tmp;
//                    }
//                }
//            }
//        }
          $data['integrations'] = [];
        $data['templates_disable'] = $dis_templates_groups;

        try {
            if (Auth::user()->getOwner() !== false) {
                $edior_id = Auth::user()->getOwner();
            } else {
                $edior_id = Auth::id();
            }
            $data['can_analytics_retargeting'] = Auth::user()->getProfileOption('analytics_retargeting') ? '' : 'disabled="disabled"';

            $data['can_redirect'] = Auth::user()->getProfileOption('redirect_page') ? '' : 'disabled="disabled"';
            $data['campaign'] = Campaigns::with('template', 'template.org_template')->where('user_id', '=', $edior_id)->where('id', '=', $CId)->firstOrFail();
            $data['domains'] = [0 => 'app.mobileoptin.com'];
            $data['domains'] += \MobileOptin\Models\Domains::where('user_id', '=', $edior_id)->where('status', '=', '2')->where('active', '=', '1')->lists('name', 'id');
            $data['ao_clicks'] = SplitTestingStats::where('campaign_id', '=', intval($CId))->where('event', '=', 'ao_navigate')->count();


            $data['original_template_id'] = 0;
        } catch (\Exception $e) {
            return redirect()->route('campaigns')->withError($e . 'Campaign not found or you do not have permissions');
        }

        $data['contact_types'] = [0=>'Manual'];
        $data['contact_types'] += \MobileOptin\Models\IntegrationsUser::where('user_id', $edior_id)->lists('name', 'id');
#dd($data['contact_types']);
        $data['user_integrations'] = \MobileOptin\Models\IntegrationsUser::where('user_id', $edior_id)->get();
        return view('campaigns.add_edit', $data);
    }




    public function editor($CId) {

        $data = array();
        \SEOMeta::setTitle('Add - Campaigns ');

        $user_id = \Auth::user()->getOwner() ? \Auth::user()->getOwner() : \Auth::id();
        session_start();
        $_SESSION["userID"] = '/public/upload/user_' . $user_id;

        $rtg = Auth::user()->allowed_groups()->with('tplgroups.templates')->get();

        $availabl_template_groups = [];

        $templates_groups = [];
        foreach ($rtg as $a) {
            foreach ($a->tplgroups as $b) {
                $availabl_template_groups[] = $b->id;
                foreach ($b->templates as $tmp) {
                    if ($tmp->active == 1) {
                        $templates_groups[$b->name][] = $tmp;
                    }
                }
            }
        }
        $data['templates'] = $templates_groups;
        $dis_templates_groups = [];
//        if ( !empty( $availabl_template_groups ) ) {
//            $ds_templategroups = TemplatesGroups::whereNotIn( 'id', $availabl_template_groups )->with( 'templates' )->get();
//
//
//            foreach ( $ds_templategroups as $b ) {
//
//
//                foreach ( $b->templates as $tmp ) {
//                    if ( $tmp->active == 1 ) {
//                        $dis_templates_groups[ $b->name ][ ] = $tmp;
//                    }
//                }
//            }
//        }
        $data['integrations'] = [];
        $data['templates_disable'] = $dis_templates_groups;

        try {
            if (Auth::user()->getOwner() !== false) {
                $edior_id = Auth::user()->getOwner();
            } else {
                $edior_id = Auth::id();
            }
            $data['can_analytics_retargeting'] = Auth::user()->getProfileOption('analytics_retargeting') ? '' : 'disabled="disabled"';

            $data['can_redirect'] = Auth::user()->getProfileOption('redirect_page') ? '' : 'disabled="disabled"';
            $data['campaign'] = Campaigns::with('template', 'template.org_template')->where('user_id', '=', $edior_id)->where('id', '=', $CId)->firstOrFail();
            $data['domains'] = [0 => 'app.mobileoptin.com'];
            $data['domains'] += \MobileOptin\Models\Domains::where('user_id', '=', $edior_id)->where('status', '=', '2')->where('active', '=', '1')->lists('name', 'id');
            $data['ao_clicks'] = SplitTestingStats::where('campaign_id', '=', intval($CId))->where('event', '=', 'ao_navigate')->count();


            $data['original_template_id'] = 0;
        } catch (\Exception $e) {
            return redirect()->route('campaigns')->withError($e . 'Campaign not found or you do not have permissions');
        }

        $data['contact_types'] = [0=>'Manual'];
        $data['contact_types'] += \MobileOptin\Models\IntegrationsUser::where('user_id', $edior_id)->lists('name', 'id');
#dd($data['contact_types']);
        $data['user_integrations'] = \MobileOptin\Models\IntegrationsUser::where('user_id', $edior_id)->get();
        return view('campaigns.add_editor', $data);
    }

    public function upsert() {
        dd(\Input::all());
    	
        $validator = \Validator::make(\Input::only('id', 'name', 'slug'), [
                    'id' => 'required|integer',
                    'name' => 'required',
                    'slug' => 'required',
        ]);

        if ($validator->fails()) {
            // The given data did not pass validation
            return redirect()->back()->withInput()->withErrors($validator);
        } else {
        	
            $user_id = Auth::user()->getOwner() ? Auth::user()->getOwner() : Auth::id();


            if (\Input::get('id') > 0) {
                $new_camp = Campaigns::where('id', '=', \Input::get('id'))->first(); //->where('user_id', '=', Auth::id())->first();
                if (!$new_camp) {
                    return redirect()->back()->withInput()->withError('Campaign not found');
                }
                else {
                    $old_optimization = $new_camp->enable_optimization;
                }
            } else {
                $new_camp = new Campaigns();

                $new_camp->user_id = $user_id;
                $old_optimization = 2;
            }


            $new_camp->name = \Input::get('name');
            $new_camp->slug = str_slug(\Input::get('slug'));
            $new_camp->domain_id = str_slug(\Input::get('domain_id'));
            $new_camp->ao_clicks = str_slug(\Input::get('ao_clicks'));
            $new_camp->ao_type= str_slug(\Input::get('ao_type'));
            $new_camp->ao_threshold = str_slug(\Input::get('ao_threshold'));
            $new_camp->enable_optimization = \Input::get('enable_optimization') == null ? 0 : 1;
            $new_camp->enable_retargeting = \Input::get('enable_retargeting') == null ? 0 : 1;
            $new_camp->enable_return_redirect = \Input::get('enable_return_redirect') == null ? 0 : 1;
            $new_camp->analitics_and_retargeting = (\Input::get('analitics_and_retargeting') == null) ? ' ' : \Input::get('analitics_and_retargeting');
            $new_camp->redirect_return_after = (\Input::get('redirect_return_after') == null) ? '' : \Input::get('redirect_return_after');
            $new_camp->redirect_return_url = (\Input::get('redirect_return_url') == null) ? '' : \Input::get('redirect_return_url');
            $new_camp->active = 1;

            $new_camp->save();

            if($new_camp->enable_optimization != $old_optimization || $new_camp->enable_optimization == 0){
                $deleteStats = SplitTestingStats::where('campaign_id', '=', $new_camp->id)
                                                ->whereIn('event', array('ao_page_open', 'ao_navigate', 'ao_optin', 'ao_pixel'))
                                                ->delete();
            }


            $user_template = \Input::get('user_template');
            $percent_container = \Input::get('percent_container');

            if (!empty($user_template)) {
                foreach ($user_template as $k => $u_tid) {
                    $u_tmpl = UserTemplates::find($u_tid);
                    if ($u_tmpl) {
                        //find and now edit
                        $u_tmpl->affect_percentile = $percent_container[$k];
                        $u_tmpl->campaign_id = $new_camp->id;
                        $u_tmpl->save();
                    }
                }
            }
            $for_deletion = UserTemplates::where('campaign_id', '=', $new_camp->id)->whereNotIn('id', $user_template)->get();
            if ($for_deletion) {
                foreach ($for_deletion as $delte_this) {
                    $delte_this->delete();
                }
            }

            if (Auth::user()->getOwner() !== false) {

                $ua = new UserAllowedCampaigns();
                $ua->user_id = Auth::id();
                $ua->campaign_id = $new_camp->id;
                $ua->save();
            }

            return redirect()->route('campaigns')->withNotify('Campaign saved');
        }
    }

    public function delete($CId) {
        try {
            if (Auth::user()->getOwner() == false) {
                $campaign = Campaigns::where('user_id', '=', Auth::id())->where('id', '=', $CId)->firstOrFail();
                if($campaign->v2) {
                    $campaign->seo()->delete();
                    $templates = UserTemplates::where('campaign_id', '=', $CId)->lists('body');
                    foreach ($templates as $key => $value) {
                        $this->deleteTemplateImages($value);
                    }
                }
                SplitTestingStats::where('campaign_id', '=', $CId)->delete();
                CampaignStats::where('campaign_id', '=', $CId)->delete();
                UserTemplates::where('campaign_id', '=', $CId)->delete();
                $campaign->forceDelete();
                return redirect()->route('campaigns')->withSuccess('Campaign Deleted');
            }
        } catch (\Exception $e) {
        }
        return redirect()->route('campaigns')->withError('Campaign not removed ');
    }

    public function change_satus($CId, $new_status) {
        try {
            if (Auth::user()->getOwner() == false) {
                $Campaign = Campaigns::where('user_id', '=', Auth::id())->where('id', '=', $CId)->firstOrFail();
            } else {
                $Campaign = Campaigns::where('user_id', '=', Auth::user()->getOwner())->where('id', '=', $CId)->firstOrFail();
            }

            if ($new_status) {
                $Campaign->activated_on = date('Y-m-d H:i:s');
            } else {
                $Campaign->deactivated_on = date('Y-m-d H:i:s');
            }
            $Campaign->active = $new_status;
            $Campaign->save();

            return redirect()->route('campaigns')->withSuccess('Campaign status changed');
        } catch (\Exception $e) {
            return redirect()->route('campaigns')->withError('Status not updated ');
        }
    }

    public function show_item($campaign_id, $slug = '', Request $request) {

        $request_id = \Request::ip();
        // get campaign_clicks by IP
        $campaign_clicks2 = SplitTestingStats::where('campaign_id', intval($campaign_id))
                        ->where('id_address', $request_id)->get();

        $data = [ 'mailto_link' => '', 'redirect_aft' => '', 'therms_of_link' => '', 'privacy_link' => '', 'contact_us_link' => ''];


        try {
            //get campaign with active templates
            $campaign = Campaigns::with('template')->
                            where('id', '=', $campaign_id)->
                            where('active', '=', 1)->
                            whereHas('template', function ( $query ) {
                                $query->where('affect_percentile', '>', 0);
                            })->first();


            if ($campaign) {

                $active_templates = [];
                //get active template IDS in Array
                foreach ($campaign->template as $ct) {
                    $active_templates[] = intval($ct->id);
                }

                // pull data from mongo
                $campaign_clicks = CampaignStats::raw(function ( $collection ) use ( $campaign_id, $active_templates ) {
                            return $collection->aggregate([
                                        [ '$match' => [
                                                'campaign_id' => intval($campaign_id),
                                                'template' => [ '$in' => $active_templates],
                                            ]],
                                        [
                                            '$group' => [
                                                '_id' => '$template',
                                                'total' => [
                                                    '$sum' => 1
                                                ]
                                            ]
                                        ]
                            ]);
                        });
                $template_stats = $campaign_clicks['result'];

                //get events for templates, statistic
                $tmpstats = SplitTestingStats::raw(function ( $collection ) use ( $campaign_id, $active_templates ) {
                            return $collection->aggregate([
                                        [ '$match' => [
                                                'campaign_id' => intval($campaign_id),
                                                'template' => [ '$in' => $active_templates],
                                            ]],
                                        [
                                            '$group' => [
                                                '_id' => [ 'event' => '$event', 'template' => '$template'],
                                                'total' => [
                                                    '$sum' => 1
                                                ]
                                            ]
                                        ]
                            ]);
                        });


                // auto optimisation of campaigns start
                $tempalte_for_auto_optimisation = [];
                if ($campaign_clicks['ok'] == 1) {
                    $tce = 0; //total campaign events triggered
                    foreach ($campaign_clicks['result'] as $ceptr) {
                        $tce += $ceptr['total'];
                    }
                    $campaign_ao_clicks = SplitTestingStats::where('campaign_id', intval($campaign_id))
                                                     ->where('event','=', 'ao_navigate')
                                                     ->count();


                    $event_per_template_raw = []; // number of events triggered by template;


                    foreach ($tmpstats['result'] as $ceptr) {
                        // get template specific statistic
                        $event_per_template_raw[$ceptr['_id']['template']][$ceptr['_id']['event']] = + $ceptr['total'];

                    }
                    $tmp_with_af_perc = [];
                    $tmp_with_af_perc_new = [];
                    // dd($event_per_template_raw, $ceptr);

                    foreach ($campaign->template as $tmp) {
                        // affect percentile array for each template...
                        if ($tmp->affect_percentile > 0) {
// sercul                            
                            if ($tmp->affect_percentile / 100 != 0) {
                                $tmp_with_af_perc[$tmp->id] = 1 - ( $tmp->affect_percentile / 100 );
                            } else {
                                $tmp_with_af_perc[$tmp->id] = 0.5;
                            }
                            $tmp_with_af_perc_new[$tmp->id] = 0.5;
                        }
                    }
                                // dd($tmp_with_af_perc);

                    $engagement_per_tmp = [];
                    $engagement_per_tmp_new = [];
                    // dd($campaign);
                    $campaign->ao_type = 'click';
                    // dd(10 % 1);
                    switch($campaign->ao_type) {
                        case 'click':  
                            foreach ($event_per_template_raw as $tmp_id => $tmp_e_t) {
                                $engagement_per_tmp[$tmp_id] = ( isset($tmp_e_t['ao_navigate']) && isset($tmp_e_t['ao_page_open']) ) ? round( ( ($tmp_e_t['ao_navigate'] * 100) / $tmp_e_t['ao_page_open'] ), 3 ) : 0;
                                // dd($engagement_per_tmp);
                            }
                            break;
                        case 'optin':
                            foreach ($event_per_template_raw as $tmp_id => $tmp_e_t) {
                                $engagement_per_tmp[$tmp_id] = ( isset($tmp_e_t['ao_optin']) && isset($tmp_e_t['ao_page_open']) ) ? round( ( ($tmp_e_t['ao_optin'] * 100) / $tmp_e_t['ao_page_open'] ), 3 ) : 0;
                            }
                            break;
                        case 'conversion':
                            foreach ($event_per_template_raw as $tmp_id => $tmp_e_t) {
                                $engagement_per_tmp[$tmp_id] = ( isset($tmp_e_t['ao_pixel']) && isset($tmp_e_t['ao_page_open']) ) ? round( ( ($tmp_e_t['ao_pixel'] * 100) / $tmp_e_t['ao_page_open'] ), 3 ) : 0;
                            }
                            break;
                    }

                    // foreach ($event_per_template_raw as $tmp_id => $tmp_e_t) {
                        // percent of user taht clicked someware
                        // $nouna = ( isset($tmp_e_t['navigate']) && isset($tmp_e_t['page_open']) ) ? ( ( $tmp_e_t['navigate'] / $tmp_e_t['page_open'] ) * 4 ) : 0;

                        // // percent of user that read the page
                        // $noure = (isset($tmp_e_t['read']) && isset($tmp_e_t['page_open'])) ? ( $tmp_e_t['read'] / $tmp_e_t['page_open'] ) * 2 : 0;

                        // // calculate the percentage
                        // $engagement_per_tmp_new[$tmp_id] = (isset($tmp_e_t['navigate']) && isset($tmp_e_t['page_open'])) ? round($tmp_e_t['navigate'] / $tmp_e_t['page_open'] * 100) : 0;
                        // $engagement_per_tmp[$tmp_id] = ( round(( $noure + $nouna ) / 2, 3) * 100 );
                    // }



//                    foreach ( $ceptnum as $k => $v ) {
//                        $ceptper [ $k ] = round( $v / $tce, 3 ) * 100;
//                    }


                    if ($campaign->ao_clicks > 0 && $campaign->ao_threshold > 0 && $campaign_ao_clicks > 0) {

                        if ($campaign->ao_clicks % $campaign_ao_clicks == 0) {

                            foreach ($engagement_per_tmp as $tid => $evinp) {
                                // for each template as event in percent

                                if ($campaign->ao_threshold > $evinp) {
                                    $tempalte_for_auto_optimisation[$tid] = true;
                                }
                            }
                        }
                    }
                    if (count($active_templates) == count($tempalte_for_auto_optimisation)) {
                        $tempalte_for_auto_optimisation = [];
                    }
                    // dd($tempalte_for_auto_optimisation);

//                    \Clockwork::info( $engagement_per_tmp );
//                    \Clockwork::info( $tmp_with_af_perc );
                }

                $total_show = 0;
                foreach ($template_stats as $tmprow) {
                    $total_show += $tmprow['total'];
                }
                $variations_real = [];
                $variations_should_be = [];
                // get the stats from mogno for all campaing in the template as they where viewed
                foreach ($template_stats as $tmprow) {
                    $variations_real[$tmprow['_id']] = round($tmprow['total'] / $total_show, 3) * 100;
                }
                // all template for that cmapaing with the perentile of how they should be shown
                foreach ($campaign->template as $tmp) {
                    if ($tmp->affect_percentile > 0) {
                        if (isset($tempalte_for_auto_optimisation[$tmp->id])) {
                            $ustt = UserTemplates::find($tmp->id);
                            if ($ustt) {
                                $ustt->affect_percentile = 0;
                                $ustt->save();
                            }
                        } else {
                            $variations_should_be[$tmp->id] = $tmp->affect_percentile;
                        }
                    }
                }
                // auto optmisation end
                // remove from calulations the templates that do not exist any more
                foreach ($variations_real as $vrid => $vrv) {
                    if (!isset($variations_should_be[$vrid])) {
                        unset($variations_real[$vrid]);
                    }
                }

                // fill mising stats for tempalte with empty values
                foreach ($variations_should_be as $k => $v) {
                    if (!isset($variations_real[$k])) {
                        $variations_real[$k] = 0;
                    }
                }

                $flag = false;
                foreach ($engagement_per_tmp as $k => $v) {
                    if ($v > 0) {
                        $flag = true;
                    }
                }

                // sercul new winner
                // $flag = false;
                // foreach ($engagement_per_tmp as $k => $v) {
                //     if ($v > $campaign->ao_threshold) {
                //         $flag = true;
                //     }
                // }
                // if ($flag == true && $tce >= $campaign->ao_clicks && $campaign->enable_optimization == 1) {
                if ($campaign_ao_clicks >= $campaign->ao_clicks && $campaign->enable_optimization == 1 && $flag == true) {

                    $max = 0;
                    $max_key = 0;
                    foreach ($engagement_per_tmp as $k => $v) {

                        if ($v > $max) {
                            $max_key = $k;
                            $max = $v;
                        }
                    }

                    foreach ($campaign->template as $rtmp) {
                        if ($max_key == $rtmp->id) {
                            $winer = $rtmp;
                            $winer->affect_percentile = 100;
                            $winer->save();
                        } else {
                            $rtmp->affect_percentile = 0;
                            $rtmp->save();
                        }
                    }
                    $campaign->enable_optimization = 0;
                    $campaign->save();
                    if(isset($new_camp))
                        $deleteStats = SplitTestingStats::where('campaign_id', '=', $new_camp->id)
                                                ->whereIn('event', array('ao_page_open', 'ao_navigate', 'ao_optin', 'ao_pixel'))
                                                ->delete();
                } else {
//                    array:2 [▼
//  748 => 14.3
//  738 => 85.7
//]
                    // find the wining template
                    $rand_array = [];
                    foreach ($variations_should_be as $k => $v) {
                        for ($i=1; $i < $v; $i++) { 
                            array_push($rand_array, $k);
                        }
                    }
                    shuffle($rand_array);
                    $win_key = array_rand($rand_array);
                    foreach ($campaign->template as $rtmp) {
                        if ($rand_array[$win_key] == $rtmp->id) {
                            $winer = $rtmp;
                        }
                    }

                    // foreach ($variations_should_be as $k => $v) {
                    //     if (isset($variations_real[$k])) {

                    //         if ($variations_real[$k] < $v && $v > 0) {
                    //             foreach ($campaign->template as $rtmp) {
                    //                 if ($k == $rtmp->id) {
                    //                     $winer = $rtmp;
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                }

                if (!isset($winer)) {
                    $winer = $campaign->template->first();
                }

                if (isset($winer) && $winer->affect_percentile > 0) {

                    if ($winer->contact_type == 0) {
                        $email = $winer->notification_email;
                    } else {
                        $email = $winer->integration_id . 'temp' . $winer->id . '@mobileresponses.com';
                    }

                    $data['mailto_link'] = 'mailto:' . $email . '?subject=' . rawurlencode($winer->email_subject) .
                            '&body=' . rawurlencode($winer->email_message);

                    $allowed_custom_url_params = \Config::get('redirect_allowed');
                    $qstring = '';
//                    $rfrsa                     = [ ];

                    foreach ($request->query() as $qsk => $qsv) {
                        if (in_array($qsk, $allowed_custom_url_params) !== false) {
                            if (stripos($winer->redirect_after, $qsk) !== false) {
//                                $qstring .= trim($qsk) . '=' . trim($qsv);
//                                $rfrsa[ ] = $qsk;
                                $winer->return_redirect = str_replace('[' . $qsk . ']', trim($qsv), $winer->return_redirect);
                                $winer->redirect_after = str_replace('[' . $qsk . ']', trim($qsv), $winer->redirect_after);
                            }
                        }
                    }

                    $winer->redirect_after = preg_replace('#(\[)(.*)(\])#si', '', $winer->redirect_after);
                    $winer->return_redirect = preg_replace('#(\[)(.*)(\])#si', '', $winer->return_redirect);

                    if (!empty($winer->redirect_after)) {
                        $data['redirect_aft'] = urldecode($winer->redirect_after . $qstring);
                        $data['return_redirect'] = urldecode($winer->return_redirect . $qstring);
                    }
                    CampaignStats::record_event($campaign->id, $winer->id, $winer->original_template_id);

                    if (isset($winer->body) && !empty($winer->body)) {

                        $data['therms_of_link'] = $winer->terms;
                        $data['privacy_link'] = $winer->privacy;
                        $data['contact_us_link'] = $winer->contact_us;
                        $data['title'] = $campaign->title;
                        $data['template_id'] = $winer->id;
                        $data['campaign_id'] = $campaign->id;

                        $user_profile = UserProfile::where('user_id', '=', $campaign->user_id)->first();
                        
                        $data['analitics_and_retargeting'] = '';
                        if($user_profile->package){
                        	if($user_profile->package->analytics_retargeting){
                        		$data['analitics_and_retargeting'] = ($campaign->enable_retargeting == 1) ? $campaign->analitics_and_retargeting : '';
                        	}
                        }else  if ($user_profile->analytics_retargeting) {
                        	$data['analitics_and_retargeting'] = ($campaign->enable_retargeting == 1) ? $campaign->analitics_and_retargeting : '';
                        }
                        if($campaign->v2 == 0) {
                            $html = new Htmldom($winer->body);
                            // dd('old');

                            // Find all images
                            foreach ($html->find('span') as $element) {
                                if (isset($element->class)) {
                                    if ($element->class == 'link') {
                                        $text = $element->innertext;
                                        /*$element->outertext = '<a href="{{$mailto_link}}" data-onclick="' . $data['redirect_aft'] . '" target="_blank">' . $text . '</a>';*/
                                        $element->outertext = '<a href="#" onclick="window.location=\'' . $data['mailto_link'] . '\'; return false;" data-onclick="' . $data['redirect_aft'] . '" target="_self">' . $text . '</a>';
                                    }
                                }
                            }
                            // dd($element);

                            foreach ($html->find('meta') as $meta_elem) {

                                if ($meta_elem->name == 'template_id') {
                                    $meta_elem->content = $winer->id;
                                }
                                if ($meta_elem->name == 'campaign_id') {
                                    $meta_elem->content = $winer->campaign_id;
                                }
                            }
                            $final_content = $html->save();
                        } else {
                            $meta_title  = ($campaign->seo) ? $campaign->seo->title : '';
                            if($meta_title == '') {
                                $meta_title = $campaign->name;
                            }
                            $meta_author = ($campaign->seo) ? $campaign->seo->author : '';
                            $meta_keywords = ($campaign->seo) ? $campaign->seo->keywords : '';
                            $meta_description = ($campaign->seo) ? $campaign->seo->description : '';
                            $seo_image = ($campaign->seo) ? $campaign->seo->seo_image : null;
                            // dd($meta_title);
                            // dd(($o));

                            $winer->body = $this->getV2TemplateCarcase($winer->body);
                            $html = new Htmldom($winer->body);
                            foreach ($html->find('title') as $value) {
                                $value->innertext = $meta_title;
                            }
                            foreach ($html->find('meta') as $value) {
                                if($value->name == 'author') {
                                    $value->content = $meta_author;
                                }
                                if($value->name == 'keywords') {
                                    $value->content = $meta_keywords;
                                }
                                if($value->name == 'description') {
                                    $value->content = $meta_description;
                                }
                                if($value->name == 'template_id') {
                                    $value->content = $winer->id;
                                }
                                if($value->name == 'campaign_id') {
                                    $value->content = $campaign_id;
                                }
                                if($value->property == 'og:image') {
                                    $value->content = url('/v2/images/uploads/'.$seo_image);
                                }
                                if($value->property == 'og:title') {
                                    $value->content = $meta_title;
                                }
                                if($value->property == 'og:description') {
                                    $value->content = $meta_description;
                                }
                            }
                            foreach ($html->find('a') as $element) {
                                if (isset($element->class)) {
                                    if ($element->class == 'mailto') {
                                        //$text = $element->innertext;
                                        /*$element->outertext = '<a href="{{$mailto_link}}" data-onclick="' . $data['redirect_aft'] . '" target="_blank">' . $text . '</a>';*/
                                        // dd($element->outertext);
                                        //$element->outertext = '<a class="mailto" href="#" onclick="window.location=\'' . $data['mailto_link'] . '\'; return false;" data-onclick="' . $data['redirect_aft'] . '" target="_self">' . $text . '</a>';
                                        $element->href = '#';
                                        $element->setAttribute('onclick', 'window.location=\'' . $data['mailto_link'] . '\'; return false;');
                                        $element->setAttribute('data-onclick', $data['redirect_aft'] . '" target="_self"');
                                    }
                                }
                            }
                           $final_content = $html->save();
                        }
                        

                        if ($campaign->enable_return_redirect == 1 && count($campaign_clicks2) >= $campaign->redirect_return_after && $campaign->redirect_return_url != ' ' && strlen($campaign->redirect_return_url) > 3) {
                            return redirect()->away($campaign->redirect_return_url);
                        } else {
                            // dd($final_content);
                            // dd(str_replace('\n', '', $final_content));
                            return \StringView::make(
                                            array(
                                        // this actual blade template
                                        'template' => $final_content . '{!! $analitics_and_retargeting !!}',
                                        // this is the cache file key, converted to md5
                                        'cache_key' => 'campaign_campaign_preview_' . md5($campaign_id . "_" . $winer->id),
                                        // timestamp for when the template was last updated, 0 is always recompile
                                        'updated_at' => time()
                                            ), $data
                            );
                        }
                    }
                }
            } else {
                // dd(5);
                return '<h5 style="margin: 10px auto 10px">Sorry this campaign has been disabled.</h5>';
            }
        } catch (Exception $e) {
            return '<h5 style="margin: 10px auto 10px">Sorry this campaign has been disabled.</h5>';
        }
    }

    private function getV2TemplateCarcase($html)
    {
        $html = str_replace('contenteditable="true"', 'contenteditable="false"', $html);
        // $html .= '<footer id="footer">'.
        //             '<nav>'.
        //                 '<ul>'. 
        //                     '<li>'.
        //                         '<a href="{{$therms_of_link}}" class="therms_of_s" target="_blank">Terms of Services</a>'. 
        //                     '</li>'. 
        //                     '<li>'.
        //                         '<a href="{{$privacy_link}}" class="privacy" target="_blank"> privacy Policy</a>'.
        //                     '</li>'. 
        //                     '<li>'.
        //                         '<a href="{{$contact_us_link}}" class="contact_us" target="_blank"> Contact us</a>'.
        //                     '</li>'.
        //                 '</ul>'. 
        //             '</nav>'. 
        //         '</footer>';
        return '<!DOCTYPE html>'.
                '<html lang="en">'.
                '<head>'.
                    '<meta charset="utf-8">'.
                    '<meta http-equiv="X-UA-Compatible" content="IE=edge">'.
                    '<meta name="viewport" content="width=device-width, initial-scale=1">'.
                    '<meta http-equiv="Cache-control" content="no-cache">'.
                    '<meta name="description" content="">'.
                    '<meta name="author" content="">'.
                    '<meta name="keywords" content="">'.
                    '<meta name="campaign_id" content="">'.
                    '<meta name="template_id" content="">'.
                    '<meta property="og:image" content=""/>'.
                    '<meta property="og:title" content="" />'.
                    '<meta property="og:description" content="" />'.
                    '<title></title>'.
                    '<link href="/v2/css/bootstrap.min.css" rel="stylesheet">'.
                    '<link href="/v2/css/fonts.css" rel="stylesheet" type="text/css">'.
                    '<link href="/v2/css/font-awesome.min.css" rel="stylesheet">'.
                    '<!-- Custom CSS -->'.
                    '<link href="/v2/css/custom_template.css" rel="stylesheet">'.
                    '<link href="/v2/css/preview_template.css" rel="stylesheet">'.
                    '<script type="text/javascript" src="/embed/js/jquery.min.js"></script>'.
                    '<script type="text/javascript" src="/embed/js/v2-notify.js"></script>'.
                '</head>'.
                '<body>'.
                '<div class="col-xs-12 col-md-6 col-md-offset-3 show-container">'.$html.
                '</div>'.
                '</body>'.
                '</html>';

    }

    public function add_template($campaign_id) {
        try {
            $new_tmp_id = 0;


            $user_id = Auth::user()->getOwner() ? Auth::user()->getOwner() : Auth::id();


            $tmp_template = new UserTemplates();
            $tmp_template->campaign_id = $campaign_id;
            $tmp_template->user_id = $user_id;
            $tmp_template->body = '';
            $tmp_template->name = '';
            $tmp_template->terms = '';
            $tmp_template->privacy = '';
            $tmp_template->return_redirect = '';
            $tmp_template->contact_us = '';
            $tmp_template->affect_percentile = '';

            $tmp_template->redirect_after = '';
            $tmp_template->notification_email = '';
            $tmp_template->integration_id = '';
            $tmp_template->contact_type = 0;
            $tmp_template->email_subject = '';
            $tmp_template->email_message = '';
            $tmp_template->name = '';


            $tmp_template->save();
            $new_tmp_id = $tmp_template->id;


            $any_existinttmp = UserTemplates::where('campaign_id', '=', $campaign_id)->first();

            if ($any_existinttmp) {

                $tmp_template->terms = $any_existinttmp->terms;
                $tmp_template->privacy = $any_existinttmp->privacy;
                $tmp_template->privacy = $any_existinttmp->privacy;
                $tmp_template->contact_us = $any_existinttmp->contact_us;

                $tmp_template->integration_id = $any_existinttmp->integration_id;
                $tmp_template->contact_type = $any_existinttmp->contact_type;


                $tmp_template->return_redirect = $any_existinttmp->return_redirect;
                $tmp_template->notification_email = $any_existinttmp->notification_email;
                $tmp_template->email_subject = $any_existinttmp->email_subject;
                $tmp_template->email_message = $any_existinttmp->email_message;
                $tmp_template->save();
            }


            return response()->json([ 'tmpl_id' => $new_tmp_id]);
        } catch (Exception $e) {
            return response()->json([]);
        }
    }
    
    public function add_change_template_modal($template_id){
    	try {
    		$rtg = Auth::user()->allowed_groups()->with('tplgroups.templates')->get();
    		$availabl_template_groups = [];
    		$templates_groups = [];
    		foreach ($rtg as $a) {
    			foreach ($a->tplgroups as $b) {
    				$availabl_template_groups[] = $b->id;
    				foreach ($b->templates as $tmp) {
    					if ($tmp->active == 1) {
    						$templates_groups[$b->name][] = $tmp;
    					}
    				}
    			}
    		}
    		$tabHeader  = '';
    		$tabContent = '';
    		$contentTab = '';
    		$any_existinttmp = UserTemplates::where('id', '=', $template_id)->first();
    
    		
    		if ($any_existinttmp) {
    			$tabCount = 0;
    			foreach ($templates_groups as $grpname => $pgrpvalue){
    				$countTemplate = 1;
    				foreach ($pgrpvalue as $tmp){
    					$selectedGroup = $any_existinttmp->original_template_id == $tmp->id ? 'active in' : '';
    					$contentTab .= '<li class="dd-subopt col-md-3">
    										<label class="dd-option col-xs-12">
    											<input class="hidden" value="' . $tmp->id . '" type="radio" name="template_choosen" />
    											<img class="dd-option-image" src="' . \URL::to('templates/' . $tmp->path) . '/preview.png" />
    											<label class="dd-option-text hidden">' . $tmp->name . '</label>	
    											<small class="dd-option-description dd-desc hidden"> Variation : ( ' . $any_existinttmp->name . ' )  <br> 
    											Redirect url :   ' . $any_existinttmp->redirect_after     . ' <br>
    											Notify E-mail :  ' . $any_existinttmp->notification_email . ' <br> 
    											E-mail Subject : ' . $any_existinttmp->email_subject      . ' </small>
    										</label>
    									</li>';
    					
    					if($countTemplate % 4 == 0)
    						$contentTab .= '<li class="clear clearfix"></li>';
    					$countTemplate++;
    				}
    				++$tabCount;
    				$tabContent .= '<div class="tab-pane fade ' . $selectedGroup . '" id="cat' . $tabCount . '">
    								<ul class="row" style="list-style: none; overflow-y: scroll; overflow-x: none; padding: 0; height: 500px;">' . 
    									$contentTab . 
    								'</ul></div>';
    				$tabHeader  .= '<li class="' . $selectedGroup . '"><a href="#cat' . $tabCount . '" data-toggle="tab">' . $grpname . '</a></li>';
    				$contentTab = '';
    			}
    		}
    		return response()->json([ 'tabHeader' => $tabHeader, 'tabContent' => $tabContent]);
    	} catch (Exception $e) {
    		return response()->json([]);
    	}
    }

    public function add_change_template($template_id) {
        try {

            $rtg = Auth::user()->allowed_groups()->with('tplgroups.templates')->get();

            $availabl_template_groups = [];

            $templates_groups = [];
            foreach ($rtg as $a) {
                foreach ($a->tplgroups as $b) {
                    $availabl_template_groups[] = $b->id;
                    foreach ($b->templates as $tmp) {
                        if ($tmp->active == 1) {
                            $templates_groups[$b->name][] = $tmp;
                        }
                    }
                }
            }

            $res = '';
            $any_existinttmp = UserTemplates::where('id', '=', $template_id)->first();

            if ($any_existinttmp) {
                $res .='<select name="template_selector" class="template_selector" id="selector_for_' . $template_id . '">';
                foreach ($templates_groups as $grpname => $pgrpvalue):
                    $res .='<optgroup label="' . $grpname . '">';
                    foreach ($pgrpvalue as $tmp):
                        $sel = $any_existinttmp->original_template_id == $tmp->id ? ' selected="selected" ' : '';
                        $res .='<option data-enabled_field="true" ' . $sel . ' value="' . $tmp->id . '" data-imagesrc="' . \URL::to('templates/' . $tmp->path) . '/preview.png" data-description=" Variation : ( ' . $any_existinttmp->name . ' )  </br> Redirect url : ' . $any_existinttmp->redirect_after . ' </br> Notify E-mail : ' . $any_existinttmp->notification_email . '</br> E-mail Subject : ' . $any_existinttmp->email_subject . '">';
                        $res .= $tmp->name;
                        $res .='</option>';
                    endforeach;
                    $res .='</optgroup>';
                endforeach;
                $res .='</select >';
            }


            return response()->json([ 'content' => $res]);
        } catch (Exception $e) {
            return response()->json([]);
        }
    }

    public function get_fresh_stats() {
        $user_id = Auth::user()->getOwner() ? Auth::user()->getOwner() : Auth::id();

        $campaigns = Campaigns::where('user_id', '=', $user_id)->with('template')->get();

        $cids = [];

        foreach ($campaigns as $c) {
            $cids[] = $c->id;
        }

        $from = \Request::input('from', '-30days');
        $to = \Request::input('to', 'now');
        $spitstats = SplitTestingStats::getMultiBasicInfo($cids, $from, $to);


        $return = [];
        foreach ($campaigns as $campaign) {
            $return[$campaign->id]['html'] = '';
            $return[$campaign->id]['totalamount'] = 0;
            if (isset($spitstats[$campaign->id])) {
                $overall = '';
                $per_variation = '';
                $confirm_text = "'Are you sure you want to reset your stats? This cannot be undone'";
                $return[$campaign->id]['html'] .= '<div class="row"><div class="col-md-12 "><div class="pd-5">';
                $return[$campaign->id]['html'] .= '<a onclick="return confirm(' . $confirm_text .');" href="' . route('reset_stats',['campaign_id'=>$campaign->id]) . '" class="btn btn-reset_stats">Reset Stats</a>';
                $return[$campaign->id]['html'] .= '<a href="' . route('extended_testing_results', [ 'campaign_id' => $campaign->id]) . '" class="btn btn-extended_stats pull-right">Detailed Stats</a> ';
                $return[$campaign->id]['html'] .= '</div></div></div>';
                $return[$campaign->id]['html'] .= '<br/>';
                $return[$campaign->id]['html'] .= '<br/>';

                $total_campaing_clicks = 0;
                $total_campaing_visitors = 0;
                $total_campaing_optins = 0;
                foreach ($spitstats[$campaign->id] as $tmp_id => $twe) {

                    if (isset($twe['total_unique'])) {
                        $total_unique = $twe['total_unique'];
                    } else {
                        $total_unique = 0;
                    }
                    if (isset($twe['total_clicks'])) {
                        $total_clicks = $twe['total_clicks'];
                      
                    } else {
                        $total_clicks = 0;
                    }
                    if (isset($twe['total_optins'])) {
                        $total_optins = $twe['total_optins'];
                      
                    } else {
                        $total_optins = 0;
                    }

                    if(isset($total_optins) && $total_optins > 0 && isset($total_unique) && $total_unique > 0){ 
                    $optin_percentage = round((($total_optins * 100) / $total_unique), 1) . '%';  
                    }
                    else{
                        $optin_percentage = '0%';   
                    }

                    $array_of_ids_templates[] = $tmp_id;
                    $afp = 0;
                    $name = '';
                    $flag = false;
                    foreach ($campaign->template as $tmpinfo) {
                        if ($tmpinfo->id == $tmp_id) {
                            $afp = $tmpinfo->affect_percentile;
                            $name = $tmpinfo->name;
                            $flag = true;
                        }
                    }
                    if ($flag == true) {
                        if ($afp == 0) {
                            $return[$campaign->id]['totalamount'] += $total_unique;
                            $per_variation .= '<div class="stats_for_t"><h5 class="template_title_qs">';
                            $per_variation .= 'Variation: ( ' . $name . ' ) - Disabled</h5>';
                            $per_variation .= '<div class="row">';
                            $per_variation .= '<div class="col-xs-4">';
                            $per_variation .= '<span class="sttitle">Visitors</span>';
                            $per_variation .= $total_unique;
                            $per_variation .= '</div>';
                            $per_variation .= '<div class="col-xs-4">';
                            $per_variation .= '<span class="sttitle">Clicks</span>';
                            $per_variation .= $total_clicks;
                            $per_variation .= '</div>';
                            $per_variation .= '<div class="col-xs-4">';
                            $per_variation .= '<span class="sttitle">Optins</span>';
                            $per_variation .= $total_optins;
                            $per_variation .= '</div>';
                            $per_variation .= '</div>';
                            $per_variation .= '<div class="row">';
                            $per_variation .= '<span class="tmp_percentage"> Conversion: ' . $optin_percentage . '</span>';
                            $per_variation .= '</div>';
                            $per_variation .= '</div>';
                        } else {
                            $return[$campaign->id]['totalamount'] += $total_unique;
                            $per_variation .= '<div class="stats_for_t"><h5 class="template_title_qs">';
                            $per_variation .= 'Variation: ( ' . $name . ' ) - ' . $afp . '% </h5>';
                            $per_variation .= '<div class="row">';
                            $per_variation .= '<div class="col-xs-4">';
                            $per_variation .= '<span class="sttitle">Visitors</span>';
                            $per_variation .= $total_unique;
                            $per_variation .= '</div>';
                            $per_variation .= '<div class="col-xs-4">';
                            $per_variation .= '<span class="sttitle">Clicks</span>';
                            $per_variation .= $total_clicks;
                            $per_variation .= '</div>';
                            $per_variation .= '<div class="col-xs-4">';
                            $per_variation .= '<span class="sttitle">Optins</span>';
                            $per_variation .= $total_optins;
                            $per_variation .= '</div>';
                            $per_variation .= '</div>';
                            $per_variation .= '<div class="row">';
                            $per_variation .= '<div class="col-xs-12">';
                            $per_variation .= '<span class="tmp_percentage"> Conversion: ' . $optin_percentage . '</span>';
                            $per_variation .= '</div>';
                            $per_variation .= '</div>';
                            $per_variation .= '</div>';
                        }
                        $total_campaing_clicks += $total_clicks;
                        $total_campaing_visitors += $total_unique;
                        $total_campaing_optins += $total_optins;
                    }
                }

                foreach ($campaign->template as $tmpinfo) {

                    if (!in_array($tmpinfo->id, $array_of_ids_templates)) {

                        if ($tmpinfo->affect_percentile == 0) {
                            $per_variation .= ' <div class="stats_for_t">
                            <h5 class="template_title_qs">Variation: ( ' . $tmpinfo->name . ' ) - Disabled</h5>
                            <div class="row">
                                <div class="col-xs-4">
                                    <span class="sttitle">Visitors</span>
                                   0
                                </div>
                                <div class="col-xs-4">
                                    <span class="sttitle">Clicks</span>
                                   0
                                </div>
                                <div class="col-xs-4">
                                    <span class="sttitle">Optins</span>
                                    0
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12" style="background-color:grey">
                                    <span class="tmp_percentage">
                                        Conversion:  0 %
                                    </span>
                                </div>
                            </div>
                        </div>';
                        } else {
                            $per_variation .= ' <div class="stats_for_t">
                            <h5 class="template_title_qs">Variation: ( ' . $tmpinfo->name . ' ) - ' . $tmpinfo->affect_percentile . ' %</h5>
                            <div class="row">
                                <div class="col-xs-4">
                                    <span class="sttitle">Visitors</span>
                                    0
                                </div>
                                <div class="col-xs-4">
                                    <span class="sttitle">Clicks</span>
                                    0
                                </div>
                                <div class="col-xs-4">
                                    <span class="sttitle">Optins</span>
                                    0
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <span class="tmp_percentage">
                                         Conversion: 0 %
                                    </span>
                                </div>
                            </div>
                        </div>';
                        }
                        $total_campaing_clicks += 0;
                        $total_campaing_visitors += 0;
                        $total_campaing_optins += 0;
                    }
                }



                $overall .= '<div class="stats_for_t"><h5 class="template_title_qs">';
                $overall .= 'Overall Campaign Stats</h5>';
                $overall .= '<div class="row">';
                $overall .= '<div class="col-xs-4">';
                $overall .= '<span class="sttitle">Visitors</span>';
                $overall .= $total_campaing_visitors;
                $overall .= '</div>';
                $overall .= '<div class="col-xs-4">';
                $overall .= '<span class="sttitle">Clicks</span>';
                $overall .= $total_campaing_clicks;
                $overall .= '</div>';
                $overall .= '<div class="col-xs-4">';
                $overall .= '<span class="sttitle">Optins</span>';
                $overall .= $total_campaing_optins;
                $overall .= '</div>';
                $overall .= '</div>';
                $overall .= '</div>';

                $return[$campaign->id]['html'] .= $overall . $per_variation;
            } else {
                $return[$campaign->id]['html'] .= '<h4>This campaign currently does not have any stats.</h4>';
            }
        }

        return response()->json($return);
    }

    public function preview_template($template_id, $org_tmp_id) {
        try {
            $otmptemplate = false;

            $data = [
                'mailto_link' => '',
                'redirect_aft' => '',
                'therms_of_link' => '',
                'privacy_link' => '',
                'contact_us_link' => '',
                'title' => '',
                'template_path' => '',
                'campaign_id' => '',
                'template_id' => '',
                'template_name' => '',
                'contact_type'=>0,
            ];

            $template = UserTemplates::find($template_id);

            $template_body = $template->body;
            if (empty($template_body) || $template->original_template_id != $org_tmp_id) {

                $otmptemplate = CampaignsTemplates::find($org_tmp_id);


                $data['template_id'] = $otmptemplate->id;
                $data['template_path'] = $otmptemplate->path;

                $template_path = 'template.' . $otmptemplate->path . '.index';
                $template_body = view($template_path, $data)->render();
            }
            
            $template->body = $template_body;
            $template->original_template_id = $org_tmp_id;
            $template->contact_type = $template->contact_type != null?$template->contact_type:0;
            $template->integration_id = $template->integration_id != null?$template->integration_id:0;
            $template->save();

            return response()->json(
                            [
                                'tmpl_body' => $template_body,
                                'template' => $template,
                                'data' => $data
                            ]
            );
        } catch (Exception $e) {
            return response()->json([]);
        }
    }

    public function save_user_template(\Illuminate\Http\Request $request) {
        dd($request->all());
        try {


            $validator = \Validator::make($request->all(), [
                        'template_id' => 'required',
                        'template_name' => 'required',
                        'template_return_email_content' => 'required',
                        'email_subject' => 'required',
                        /*'redirect_after' => 'required',*/
                        'notification_email' => 'required',
                        'return_redirect_link' => 'string',
                        /*'contact_link' => 'required',
                        'privacy_link' => 'required',
                        'therms_link' => 'required',*/
                        'org_tmp_id' => 'required',
                        'page_content' => 'required',
            ]);

            if ($validator->fails()) {


                return response()->json([ 'errors' => $validator->errors()->all()]);
            } else {
                $template = UserTemplates::find(\Input::get('template_id'));


                $html = new Htmldom(\Input::get('page_content'));
                $ignoreparse = 'data-ignore';
                // Find all images
                foreach ($html->find('a') as $element) {

                    if (isset($element->href) && !isset($element->$ignoreparse)) {
                        $element->href = '{{$mailto_link}}';
                    }
                    if (isset($element->onclick)) {
                        $element->onclick = '{!!$redirect_aft!!}';
                    }
                    if (isset($element->class)) {
                        switch ($element->class) {
                            case 'therms_of_s':
                                $element->href = '{{$therms_of_link}}';
                                break;
                            case 'privacy':
                                $element->href = '{{$privacy_link}}';
                                break;
                            case 'contact_us':
                                $element->href = '{{$contact_us_link}}';
                                break;
                        }
                    }
                }
                foreach ($html->find('meta') as $meta_elem) {

                    if ($meta_elem->name == 'template_id') {
                        $meta_elem->content = $template->id;
                    }
                    if ($meta_elem->name == 'campaign_id') {
                        $meta_elem->content = $template->campaign_id;
                    }
                }
                $template_content = $html->save();


                $template->original_template_id = \Input::get('org_tmp_id');
                $template->terms = \Input::get('therms_link');
                $template->privacy = \Input::get('privacy_link');
                $template->contact_us = \Input::get('contact_link');
                $template->return_redirect = \Input::get('return_redirect_link');
                $template->notification_email = \Input::get('notification_email');
                $template->redirect_after = \Input::get('redirect_after');
                $template->email_subject = \Input::get('email_subject');
                $template->contact_type = \Input::get('contact_type');
                $template->integration_id = \Input::get('integration_id');
                $template->email_message = \Input::get('template_return_email_content');
                $template->name = \Input::get('template_name');
                $template->body = $template_content;

                $template->save();
            }

            return response()->json([]);
        } catch (Exception $e) {
            return response()->json([]);
        }
    }

    public function remove_user_template() {
        $template_id = \Input::get('tempalte_id');
        $user_id = Auth::user()->getOwner() ? Auth::user()->getOwner() : Auth::id();

        if (!empty($template_id) && !empty($user_id)) {
            try {
                $template = UserTemplates::where('user_id', '=', $user_id)->where('id', '=', $template_id)->first();
                if ($template) {
                    $template->delete();
                    SplitTestingStats::where('template', '=', intval($template_id))->delete();
                    CampaignStats::where('template', '=', intval($template_id))->delete();
                    return response()->json([ 'status' => true]);
                }
            } catch (\Exception $e) {
                
            }
        }
        return response()->json([ 'status' => false]);
    }

    public function campaigns_assinged($cid) {
        $data = [];
        $data['campaign'] = Campaigns::with('template')->where('user_id', '=', Auth::id())->where('id', '=', $cid)->firstOrFail();
        $data['assinged'] = User::with('profile', 'allowed_campaigns', 'role', 'owner')->whereHas('owner', function ( $query ) {
                    $query->where('owner_id', '=', Auth::id());
                })->whereHas('allowed_campaigns', function ( $query ) use ( $cid ) {
                    $query->where('campaign_id', '=', $cid);
                })->paginate(10)->setPath('campaigns/assinged /' . $cid);

        $data['not_assinged'] = User::with('profile', 'allowed_campaigns', 'role', 'owner')->whereHas('owner', function ( $query ) {
                    $query->where('owner_id', '=', Auth::id());
                })->whereHas('allowed_campaigns', function ( $query ) use ( $cid ) {
                    $query->where('campaign_id', '=', $cid);
                }, ' != ')->get()->lists('name', 'id');

        return view('campaigns.assinged', $data);
    }

    public function save_campaigns_assinged() {
        $cid = \Input::get('id');
        $uid = \Input::get('assing_other');

        $user = User::with('profile', 'allowed_campaigns', 'role', 'owner')->whereHas('owner', function ( $query ) {
                    $query->where('owner_id', '=', Auth::id());
                })->whereHas('allowed_campaigns', function ( $query ) use ( $cid ) {
                    $query->where('campaign_id', '=', $cid);
                }, ' != ')->where('id', '=', $uid)->first();

        if (isset($user->id)) {

            $ua = new UserAllowedCampaigns();
            $ua->user_id = $uid;
            $ua->campaign_id = $cid;
            $ua->save();
            return redirect()->route('campaigns_assinged', [ 'id' => $cid])->withSuccess('user saved ');
        }
        return redirect()->route('campaigns_assinged', [ 'id' => $cid])->withError('user not added ');
    }

    public function remove_assingment($cid, $uid) {
    	
    		$user = User::whereHas('owner', function ( $query ) {
    			$query->where('owner_id', Auth::id());
    		})->whereHas('allowed_campaigns', function ( $query ) use ( $cid ) {
    			$query->where('campaign_id', $cid);
    		})->where('id', $uid)->first();
    		
        if (isset($user->id)) {
            UserAllowedCampaigns::where('user_id', '=', $uid)->where('campaign_id', '=', $cid)->delete();
            return redirect()->route('campaigns_assinged', [ 'id' => $cid])->withSuccess('user removed ');
        }
        return redirect()->route('campaigns_assinged', [ 'id' => $cid])->withError('user not removed ');
    }

    public function camplist($integration_id, $json = true) {
        // dd($integration_id);
        $integration = \MobileOptin\Models\IntegrationsUser::where('id', $integration_id)->first();
        if ($integration) {
            $client = new \GuzzleHttp\Client();

            try {
                $arr = [];

                if (!$integration->type_id || $integration->type_id == 1) {
                	Log::info("[+++++++++++++++++++++++++++++++++++++++++++++++++++++++++]");
                	Log::info("[GETRESPONSE API KEY ] " . $integration->api_key);
                    // GetResponse
                    $response = $client->get('https://api.getresponse.com/v3/campaigns', [
                        'headers' => ['X-Auth-Token' => 'api-key ' . $integration->api_key, 'Content-Type' => ' application/json'],
                        'allow_redirects' => false,
                        'timeout' => 5
                    ]);
                    
                    Log::info("[STATUS CODE ] " . $response->getStatusCode());
                    Log::info("[+++++++++++++++++++++++++++++++++++++++++++++++++++++++++]");
                    
                    if ($response->getStatusCode() == '200') {
                        $json_resp = json_decode($response->getBody(), true);
                        foreach ($json_resp as $jsp) $arr[$jsp['campaignId']] = $jsp['name'];
                    }
                } else if($integration->type_id == 2) {
                    
                    // Aweber
                    $integration_types = \MobileOptin\Models\IntegrationsType::all()->keyBy('id');
                    
                    // the AWeber package does not properly define a namespace for itself and is not getting mapped by Composer, so just include it
                    require_once base_path('vendor/aweber/aweber/aweber_api/aweber.php');
                    
                    $aweber_consumer_key    = !empty($integration->api_key) ? $integration->api_key : $integration_types[2]->oauth_key;
                    $aweber_consumer_secret = !empty($integration->access_token) ? $integration->access_token : $integration_types[2]->oauth_secret;
                    $aweber_access_key      = $integration->organizerKey;
                    $aweber_access_secret   = $integration->authorization;
                    $aweber                 = new \AWeberAPI($aweber_consumer_key, $aweber_consumer_secret);
                    $aweber_account         = $aweber->getAccount($aweber_access_key, $aweber_access_secret);
                    $list_url               = "/accounts/{$aweber_account->id}/lists/";
                    $lists                  = $aweber_account->loadFromUrl($list_url);
                    
                    foreach($lists->data['entries'] as $list) {
                        $arr[$list['id']] = $list['name'];
                    }
                    
                    $nb_list_loaded       = count($arr);
                    $total_list_available = $lists->data['total_size'];

                    //load all the remain list
                    while($total_list_available  > $nb_list_loaded) {
                        $max_ws_size = ($total_list_available - $nb_list_loaded) > 100 ? 100 : ($total_list_available - $nb_list_loaded);
                        $list_url_with_params = $list_url . '?ws.start=' . $nb_list_loaded . '&ws.size=' . $max_ws_size;
                        $lists     = $aweber_account->loadFromUrl($list_url_with_params);

                        foreach($lists->data['entries'] as $list) {
                            $arr[$list['id']] = $list['name'];
                        }
                        $nb_list_loaded = count($arr);
                    }

                } else if($integration->type_id == 3) {
                    // Gotowebinar
                    
                	//access_token   => api_key
                	//refresh_token  => authorization
                	//account_key    => local_api_key
                	//consumer_key   => organizerKey
                	Log::info("[API KEY ] " . $integration->api_key);
                	Log::info("[ACCESS TOKEN ] " .  $integration->access_token);
                	try{
                		$response = $client->get(
	                				'https://api.citrixonline.com/G2W/rest/organizers/' . $integration->api_key .  '/webinars',
	                				[
		                				'headers' => [
			                				'Authorization' => 'OAuth oauth_token=' . $integration->access_token,
			                				'Content-Type'  => 'application/json',
			                				'Accept'        => 'application/json'
			                				],
		                				'allow_redirects' => false,
		                				'timeout' => 5
	                				]);
                		
                		
                		if ($response->getStatusCode() == '200') {
                			$json_resp = json_decode($response->getBody(), true);
                			foreach ($json_resp as $jsp) $arr[$jsp['webinarKey']] = $jsp['subject'];
                		}
                	}catch (Exception $exception){
                		Log::debug("[EXCEPTION MESSAGE ] " . $exception->getMessage());
                	}
                } else if($integration->type_id == 5) {
                	
                	list($realApiKey, $datacenter) = explode('-', $integration->api_key);
                	// MailChimp
                    $response = $client->get('https://' . $datacenter . '.api.mailchimp.com/3.0/lists', [
                        'headers'         => [
                    							'Authorization' => 'api-key ' . $integration->api_key, 
                    							'Accept' => ' application/json'
                            				 ],
                        'allow_redirects' => false,
                        'timeout'         => 10
                    ]);
                	
                    if ($response->getStatusCode() == '200') {
                    	$campaignsList = json_decode($response->getBody(), true);
                    	if(!empty($campaignsList['lists']) && count($campaignsList['lists']) == (int)$campaignsList['total_items'] ){
	                    	foreach ($campaignsList['lists'] as $key => $campaign) $arr[$campaign['id']] = $campaign['name'];
                    	}else{
                    		if((int)$campaignsList['total_items'] > 0){
                    			$response = $client->get('https://' . $datacenter . '.api.mailchimp.com/3.0/lists', [
                    					'headers'         => [
						                    					'Authorization' => 'api-key ' . $integration->api_key,
						                    					'Accept' => ' application/json'
						                    				 ],
                    					'allow_redirects' => false,
                    					'timeout'         => 10,
                    					'query'           => array('count' => $campaignsList['total_items'])
                    			]);
                    			
                    			if ($response->getStatusCode() == '200') {
                    				$campaignsList = json_decode($response->getBody(), true);
                    				if(!empty($campaignsList['lists']))
                    					foreach ($campaignsList['lists'] as $key => $campaign) $arr[$campaign['id']] = $campaign['name'];
                    			}
                    		}	
                    	}
                    }
                	
                }else if($integration->type_id == 7) {
                	// GVO eResponder Pro [Fecth campaign lists]
                	Log::info(" API KEY FOR GVO REQUEST " . $integration->api_key );
                	
                    $response = $client->send($client->createRequest('POST', 'http://gogvo.com/api/eresponder/get_campaigns', [
                    	'headers'         => [ 'Accept'  => ' application/json', 'Content-Type'  => 'application/x-www-form-urlencoded' ],
                        'body'            => [ 'api_key' => $integration->api_key ],
                        'allow_redirects' => false,
                    	'timeout'         => 45
                    ]));
                	
                   if ($response->getStatusCode() == '200') {
                   		Log::info($response->getBody());
                    	$campaignsListResponse = json_decode($response->getBody(), true);
                    	if($campaignsListResponse['status'] == 'success'){
                    		if(!empty($campaignsListResponse['Campaigns'])){
                    			$campaignsList = $campaignsListResponse['Campaigns'];
                    			foreach ($campaignsList as $key => $campaign) $arr[$key] = $campaign['Name'];
                    		}	
                    	}
                   }
                }else if($integration->type_id == 8){
                	//SendLane
                	$response = $client->send($client->createRequest('POST', 'https://'. $integration->authorization .'/api/v1/lists', [
	                			'headers'         => [ 
	                				'Accept'  => ' application/json', 
	                				'Content-Type'  => 'application/x-www-form-urlencoded' 
	                           	],
	                			'body'            => [
                					'api'  => $integration->api_key,
                					'hash' => $integration->organizerKey 
                            	],
	                			'allow_redirects' => false,
	                			'timeout'         => 45
                			]));
                	 
                	if ($response->getStatusCode() == '200') {
                		$campaignsListResponse = json_decode($response->getBody(), true);
                		Log::debug("CAMPAIGN SENDLANE LIST RESPONSE " . $response->getBody());
                		if(!empty($campaignsListResponse)){
                			if(empty($campaignsListResponse['info'])){
                				foreach ($campaignsListResponse as $key => $campaign) 
                					$arr[$campaign['list_id']] = $campaign['list_name'];
                			}
                		}
                	}
                }else if($integration->type_id == 9){
                	//WebinarJam
                	$response = $client->send($client->createRequest('POST', 'https://app.webinarjam.com/api/v2/webinars', [
		                			'headers'         => [
		                				'Accept'        => ' application/json',
		                				'Content-Type'  => 'application/x-www-form-urlencoded'
		                			],
		                			'body'            => [
		                				'api_key' => $integration->api_key
		                			],
		                			'allow_redirects' => false,
		                			'timeout'         => 45
	                			]));
                	
                	if ($response->getStatusCode() == '200') {
                		$campaignsListResponse = json_decode($response->getBody(), true);
                		Log::debug("CAMPAIGN WEBINARJAM LIST RESPONSE " . $response->getBody());
                		if(!empty($campaignsListResponse)){
                			if(!empty($campaignsListResponse['status']) && 
                					 $campaignsListResponse['status'] == 'success' &&
                					 count($campaignsListResponse['webinars'])  > 0
                    			){
                				foreach ($campaignsListResponse['webinars'] as $key => $campaign)
                					$arr[$campaign['webinar_id']] = $campaign['name'];
                			}
                		}
                	}
                }else if($integration->type_id == 10){
                	
                	\MailWizzApi_Autoloader::register();
                	
                	$storagePath = storage_path() . '/MailWizzApi/cache/' . Auth::id();
                	
                	if ( !File::exists( $storagePath ) ) {
                		File::makeDirectory( $storagePath, 0755, true);
                	}
                	
                	// configuration object
                	$config = new \MailWizzApi_Config([
                			'apiUrl'        => 'http://dashboard.sendreach.com/api/index.php',
                			'publicKey'     => $integration->api_key,
                			'privateKey'    => $integration->authorization,
                	
                			// components
                			'components' => [
                				'cache' => [
                					'class'     => 'MailWizzApi_Cache_File',
                					'filesPath' => $storagePath,
                				]
                			],
                	]);
                	
                	\MailWizzApi_Base::setConfig($config);
                	$currentPage           = 1;
                	$nbByPage              = 10;
                	$endpoint              = new \MailWizzApi_Endpoint_Lists();
                	$response              = $endpoint->getLists($currentPage, $nbByPage);
                	$campaignsListResponse = $response->body->toArray();
                	
                	Log::debug("CAMPAIGN SENDREACH LIST RESPONSE " . json_encode($campaignsListResponse));
                	if(!empty($campaignsListResponse)){
                		if(!empty($campaignsListResponse['status']) &&  $campaignsListResponse['status'] == 'success'){
                			if($campaignsListResponse['data']['count'] > 0){
                				foreach ($campaignsListResponse['data']['records'] as $key => $campaign)
                					$arr[$campaign['general']['list_uid']] = $campaign['general']['name'];
                				
                				
                				if((int)$campaignsListResponse['data']['count'] > $nbByPage){
                					$arr       = [];
                					$response  = $endpoint->getLists(1, $campaignsListResponse['data']['count']);
                					$campaignsListResponse = $response->body->toArray();
                					Log::debug("ALL CAMPAIGN SENDREACH LIST FETCHED " . json_encode($campaignsListResponse));
                				
                					if(!empty($campaignsListResponse)){
                						if(!empty($campaignsListResponse['status']) &&  $campaignsListResponse['status'] == 'success'){
                							if($campaignsListResponse['data']['count'] > 0){
                								foreach ($campaignsListResponse['data']['records'] as $key => $campaign)
                									$arr[$campaign['general']['list_uid']] = $campaign['general']['name'];
                							}
                						}
                					}
                				}
                			}
                		}
                	}
                }else if($integration->type_id == 11){
                	// Fluttermail
                	$response = $client->get('https://em.fluttermail.com/admin/api.php', [
		                			'headers'         => [ 'Accept'  => ' application/json' ],
		                			'allow_redirects' => false,
		                			'timeout'         => 45,
	                				'query'           => [
			                			'api_key'    => $integration->api_key,
			                			'api_action' => 'list_list',
			                			'api_output' => 'json',
			                			'ids'        => 'all',
			                			'full'       => 1
		                			]
	                			]);
                	
                	if ($response->getStatusCode() == '200') {
                		$campaignsListResponse = json_decode($response->getBody(), true);
                		Log::debug("FLUTTER MAIL LIST RESPONSE " . $response->getBody());
                		if(!empty($campaignsListResponse)){
                			if( ! empty($campaignsListResponse['result_code']) && $campaignsListResponse['result_code'] == 1 ){
                				foreach ($campaignsListResponse as $key => $campaign)
                					if(is_numeric($key))
                						$arr[$campaign['id']] = $campaign['name'];
                			}
                		}
                	}
                }
                if(!$json) {
                    return $arr;                    
                }
                return response()->json($arr);
            } catch (ClientException $e) {
                return response()->json([]);
            }
        }

        return response()->json([]);
    }

    // display pixel and log event to database
    public function get_pixel($user_template_id)
    {
        $user_template = \MobileOptin\Models\UserTemplates::where('id', $user_template_id)->first();

        // record pixel event to Mongo database
        $event = 'pixel';
        $label = 'pixel';
        $name = $user_template->name;
        $value = 1;
        $save_response = SplitTestingStats::record_event($user_template->campaign_id, $user_template_id, $event, $label, $name, $value);

        Log::info('Recording pixel event:');
        Log::info($save_response);

        // output 1x1 pixel
        header('Content-Type: image/gif');
        //equivalent to readfile('pixel.gif')
        echo "\x47\x49\x46\x38\x37\x61\x1\x0\x1\x0\x80\x0\x0\xfc\x6a\x6c\x0\x0\x0\x2c\x0\x0\x0\x0\x1\x0\x1\x0\x0\x2\x2\x44\x1\x0\x3b";
    }
}

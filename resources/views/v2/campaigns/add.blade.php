<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="a-token" content="{{csrf_token()}}"/>
    <meta http-equiv="Cache-control" content="no-cache">


    <title>
        @if($campaign->id > 0)
            Edit campaign
        @else
            Create campaign
        @endif
    </title>

    <link href="/v2/css/bootstrap.min.css" rel="stylesheet">
    <link href="/v2/css/fonts.css" rel="stylesheet" type='text/css'>
    <link href="/v2/css/font-awesome.min.css" rel="stylesheet">
    <link href="/v2/css/medium-editor.min.css" rel="stylesheet">
    <link href="/v2/css/colorpicker.css" rel="stylesheet">

    <link href="/v2/css/bootstrap-switch.min.css" rel="stylesheet">
    <link href="/v2/css/jquery-ui.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="/v2/css/custom.css" rel="stylesheet">
    <link href="/v2/css/custom_template.css" rel="stylesheet">
    <style type="text/css">
        
    <?php
         $css1=  File::get( public_path(). Minify::stylesheet(
         ['/css/template.css']
         )->onlyUrl());
             $css1=  str_replace('../fonts/',URL::to('/fonts/').'/',$css1);
             $css1=   str_replace('../images/',URL::to('/images/').'/',$css1);
             echo  str_replace('../img/',URL::to('/img/').'/',$css1);
    ?>
    </style>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>
@include('include.navigation')
<!-- Header Part -->
<!-- <div class="container-fluid">
    <div class="row">

        <div class="col-md-12 headSection">
            <div class="col-md-6 headTitle text-left">
                Create Campaign
            </div>
            <div class="col-md-6 text-center">

            </div>
        </div>

    </div>
</div> -->

<div class="container-fluid">
    <div class="row" id="main-content">
        <!-- Left Part -->
        <div class="col-md-6 leftMenu">
            <!-- Left Menu Section -->
            <div class="col-md-4 leftMenuItem">
                <dl>
                    <dt><img src="/v2/img/icon-dash.png" alt="" width="18"><a class="cmnts">Components</a></dt>
                    <dt class="sepdt">or drag elements:</dt>
                    <dt class="draggableBlock"><img src="/v2/img/icon-square.png" alt="" height="15"><a>Container</a></dt>
                    <dt class="draggableHead"><img src="/v2/img/icon-h.png" alt="" height="15"><a>Headline</a></dt>
                    <dt class="draggableText"><img src="/v2/img/icon-line.png" alt="" width="18"><a>Text</a></dt>
                    <dt class="draggableImg"><img src="/v2/img/icon-mount.png" alt="" width="18"><a>Image</a></dt>
                    <dt class="draggableMail"><img src="/v2/img/icon-envelope.png" alt="" width="18"><a>Mail To Box</a></dt>
                    <dt class="draggableVideo"><img src="/v2/img/icon-video.png" alt="" width="18"><a>Video</a></dt>
                </dl>

                <hr class="leftMenuHr">

                <dl>
                    <dt class="setVarIcon"><a class="cmpSet"><i class="glyphicon glyphicon-cog"></i>Campaign Settings</a></dt>
                </dl>
                <div class="subSecVar nano-content">
                    <dl>
                    @if(count($variations) === 0)
                            <dt class="varEvent">
                                <!-- ********************************** -->
                                <a class="var campaign-variations"><i class="glyphicon glyphicon-cog"></i>Variation</a>
                                <!-- ********************************** -->
                                <a onclick="delVariation(this)"><i class="glyphicon glyphicon-trash"></i></a>
                                <div class="form-group">
                                    <div class="input-group hidden">
                                        <input type="text" class="form-control TrafficAllocation" value="100%"/>
                                    </div>
                                </div>
                            </dt>
                    @elseif(count($variations) === 1)
                            <dt class="varEvent">
                                <!-- ********************************** -->
                                <a class="var campaign-variations active" data-id="{{$template->id}}"><i class="glyphicon glyphicon-cog"></i>{{$template->name}}</a>
                                <!-- ********************************** -->
                                <a onclick="delVariation(this)"><i class="glyphicon glyphicon-trash"></i></a>
                                <div class="form-group">
                                    <div class="input-group hidden">
                                        <input type="text" class="form-control TrafficAllocation" data-id="{{$template->id}}" value="100%"/>
                                    </div>
                                </div>
                            </dt>
                    @else
                            <dt class="varEvent">
                                <!-- ********************************** -->
                                <a class="var campaign-variations active" data-id="{{$template->id}}"><i class="glyphicon glyphicon-cog"></i>{{$template->name}}</a>
                                <a onclick="delVariation(this)"><i class="glyphicon glyphicon-trash"></i></a>
                                <div class="form-group">
                                    <div class="input-group">
                                        <input type="text" class="form-control TrafficAllocation" data-id="{{$template->id}}" value="{{$template->affect_percentile}}%"/>
                                    </div>
                                </div>
                                <!-- ********************************** -->
                            </dt>
                        @foreach($variations as $variation)
                            @if($variation->id != $template->id)                                
                                    <dt class="varEvent">
                                        <!-- ********************************** -->
                                        <a class="var campaign-variations" data-id="{{$variation->id}}"><i class="glyphicon glyphicon-cog"></i>{{$variation->name}}</a>
                                        <!-- ********************************** -->
                                        <a onclick="delVariation(this)"><i class="glyphicon glyphicon-trash"></i></a>
                                        <div class="form-group">
                                            <div class="input-group">
                                                <input type="text" class="form-control TrafficAllocation" data-id="{{$variation->id}}" value="{{$variation->affect_percentile}}%"/>
                                            </div>
                                        </div>
                                    </dt>
                            @endif   
                        @endforeach
                    @endif
                    </dl>
                    <div class="addVarIcon">
                        <a>
                            <div class="circleIcon">+<br>add</div>
                        </a>
                    </div>
                    <div id="preview">
                        <button type="submit" class="btn btn-lg btn-warning">Preview</button>
                    </div>
                    <div id="main-save" @if($campaign->id == 0) style="display: none;" @endif>
                        <button type="submit" class="btn btn-lg btn-warning">Save</button>
                    </div>
                </div>
            </div>
<!-- ************************************************************************************************************* -->
            <!-- Settings Section 1 Variation Settings -->
            @if(count($variations)> 0)
            <div id='mdprt1' class="col-md-8 middlePart">
            @else
            <div id='mdprt1' class="col-md-8 middlePart hidden">
            @endif    

                <!-- Variation Settings Section -->
                <div class='close-window pull-right'><i class="glyphicon glyphicon-remove"></i></div>
                <div class="varSetSec">
                    <div class="titleMiddlePart">Variation Settings</div>

                    <form id="variation-form">
                        <div class="form-group">
                            {!! Form::text('name',$template->name ,['required', 'placeholder'=>'Variation (Name)','id'=>'VariationName','class'=>'form-control']) !!}
                        </div>
                        <!-- <div class="form-group inner-addon right-addon">
                            <i class="glyphicon glyphicon-info-sign" rel="tooltip6" title="While this is not a required field, if you do have a terms of service page you can link to it here. It will show up on the bottom of your newly created optin page"></i>
                            {!! Form::url('terms',$template->terms ,['placeholder'=>'Terms of service URL','id'=>'TermsOfServiceURL','class'=>'form-control']) !!}
                        </div>
                        <div class="form-group inner-addon right-addon">
                            <i class="glyphicon glyphicon-info-sign" rel="tooltip7" title="While this is not a required field, if you do have a terms of service page you can link to it here. It will show up on the bottom of your newly created optin page"></i>
                            {!! Form::url('privacy',$template->privacy ,['placeholder'=>'Privacy policy URL','id'=>'PrivacyPolicyURL','class'=>'form-control']) !!}
                        </div>
                        <div class="form-group inner-addon right-addon">
                            <i class="glyphicon glyphicon-info-sign" rel="tooltip8" title="You may enter mailto:youremailaddress or enter a URL for your contact information here. If you do not wish to provide this you can leave this box blank"></i>
                            {!! Form::url('contact_us',$template->contact_us ,['placeholder'=>'Contact Us URL','id'=>'ContactUsURL','class'=>'form-control']) !!}
                            
                        </div> -->
                        <div class="form-group">
                            <!--input type="number" class="form-control" id="ChooseIntegration" placeholder="Choose Integration"-->
                            <div class="input-group">
                                <select name="contact_type" id="contact_type" class="form-control" @if(!in_array('integrations', $access_permissions)) disabled @endif>
                                   <option value="0" data-type-id="0">Manual</option>
                                       @foreach($user_integrations as $type)
                                          <option @if($type->id == $template->contact_type) selected="selected" @endif value="{{ $type->id }}" data-type-id="{{ $type->type_id }}">{{ $type->name }}</option>
                                       @endforeach
                                   </select>
                            </div>
                        </div>
                        <div class="form-group">
                            {!! Form::select('integration_id', $integrations ,$template->integration_id,['id'=>'integration_id','class'=>'form-control'])   !!}
                            <div id="aweber-note" class='alert alert-warning hide'>
                                <strong>IMPORTANT!</strong>  Single optin is not turned on by default for Aweber.  
                                In order to enable single optin for your lists you MUST contact Aweber support and ask them to enable single optin for each of your lists.
                            </div>
                        </div>
                        <div class="form-group" @if($template->contact_type > 0) style="display: none;" @endif>
                            {!! Form::email('notification_email',$template->notification_email ,['placeholder'=>'Notification Email','id'=>'NotificationEmail','class'=>'form-control']) !!}
                        </div>
                        <div class="form-group">
                            {!! Form::url('redirect_after',$template->redirect_after ,['required','placeholder'=>'Redirect after optin','id'=>'RedirectAfterOptin','class'=>'form-control']) !!}
                        </div>
                        <div class="form-group">
                            {!! Form::text('email_subject',$template->email_subject ,['required', 'placeholder'=>'Return Email subject','id'=>'ReturnEmailSubject','class'=>'form-control']) !!}
                        </div>
                         <div class="form-group">
                            <textarea class="form-control" name="email_message" id="ReturnEmailBody" required placeholder="Return Email body" rows="6.5">{{$template->email_message}}</textarea>
                        </div>

                        <!-- <button type="submit" class="btn btn-lg btn-warning" id="variation-save">Save Changes</button> -->
                    </form>
                </div>

            </div>

            <!-- Settings Section 2 Campaign Settings -->
            <div id='mdprt2' class="col-md-8 middlePart hidden">
                <div class='close-window pull-right'><i class="glyphicon glyphicon-remove"></i></div>

                <!-- Campaign Settings and SEO & Social Section -->
                <div class="setAndSeo">

                    <ul class="nav nav-tabs">
                        <li class="active"><a data-toggle="tab" href="#CampaignSettings">Campaign Settings</a></li>
                        <li><a data-toggle="tab" href="#SeoSocial">SEO & Social</a></li>
                    </ul>

                    <div class="tab-content">
                        <!-- ************* Campaign Settings TAB *********** -->
                        <div id="CampaignSettings" class="tab-pane fade in active">

                            <form>
                                {!! Form::hidden('id', $campaign->id,['id'=>'campaign_id']) !!}
                                <!-- ********************************** -->
                                <div class="form-group">
                                    {!! Form::text('name',$campaign->name ,['required', 'placeholder'=>'Campaign name','id'=>'name','class'=>'form-control']) !!}
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group">
                                    {!! Form::text('slug',$campaign->slug ,['required', 'placeholder'=>'Campaign URL','id'=>'slug','class'=>'form-control']) !!}
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group">
                                    {!! Form::select('domain_id', $domains ,$campaign->domain_id,['placeholder'=>'Campaign Domain','id'=>'domain_id','class'=>'form-control'])   !!}
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group">
                                    <div class="make-switch">
                                        {!! Form::checkbox('enable_retargeting', 1 , (!empty($campaign->enable_retargeting) && $campaign->enable_retargeting == 1 ? $campaign->enable_retargeting : false) ,[ 'id'=>'enable_retargeting','class' => 'probeProbe1']) !!}
                                        <div class="switchTitle">Enable Retargeting</div>
                                    </div>
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group analitAndRetarget_div" @if(!$campaign->enable_retargeting) style="display: none;" @endif>
                                    <div class="txtTitle">
                                        Analytics and Retargeting code
                                        <i id="infoIcon1" class="glyphicon glyphicon-info-sign" rel="tooltip1" title="In this box you can place retargeting pixels from Facebook and any other advertising network. This pixel will be set on anyone who visits your MobileOptin page. This allows you to retarget your ads to all of your visitors. You can also set a Google Analytics code on your pages so you are able to get detailed information on the visitors you are receiving."></i>
                                    </div>
                                    <textarea {!!$can_analytics_retargeting!!} rows="6.5"
                                    id="analitics_and_retargeting" name="analitics_and_retargeting" class="form-control">{{$campaign->analitics_and_retargeting}}</textarea>
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group">
                                    <div class="make-switch">
                                        {!! Form::checkbox('enable_optimization', 1 ,$campaign->enable_optimization ,[ 'id'=>'enable_optimization','class' => 'probeProbe2']) !!}
                                        <div class="switchTitle">Enable Optimization</div>
                                    </div>
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group returnClickors_div" @if($campaign->enable_optimization == 0) style="display:none" @endif>
                                    <div class="numboxTitle">
                                        <span>Optimize After</span>
                                        <br>
                                        Number of clicks
                                        <i id="infoIcon7" class="glyphicon glyphicon-info-sign" rel="tooltip9" title="Allow mobile optin to optimize your campaign after x amount of clicks automatically. Once your campaign has reached x number of clicks it will disable the variations with the lowest conversion rates and keep the highest converting variation as the winner."></i>
                                    </div>
                                    <div class="input-group">
                                        <input type="text" class="form-control" name="ao_clicks" value="{{$campaign->ao_clicks}}" id="CampaignOptimize" />
                                        <div class="input-group-btn-vertical">
                                            <button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button>
                                            <button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <!-- ********************************** -->
                                <div class="alert alert-danger optimization_alert" role="alert" style="display: none;">You cannot use optimization with less than 2 templates</div>
                                <!-- ********************************** -->
                                <div class="form-group returnClickors_div" @if($campaign->enable_optimization == 0) style="display:none" @endif>
                                    @if(isset($ao_clicks))
                                    <div class="uelboxTitle">
                                        <span>Campaign has <span id="numbCamp">{!! $ao_clicks !!}</span></span>
                                        <br>
                                        optimization clicks
                                        <i id="infoIcon8" class="glyphicon glyphicon-info-sign" rel="tooltip10" title="Our Auto-Optimization feature allows you to optimize your campaigns to generate more “clicks” on the call to action button, more “optins” which is people actually sending the email and opting in to your list, or “conversions” if you are using our conversion pixel found in the detailed stats section. We always suggest optimizing for “optins” but it’s totally up to you! If you need more information please watch our FAQ video on this feature."></i>
                                    </div>
                                    @endif
                                    <div class="btn-group" data-toggle="buttons">
                                        <label class="btn btn-info @if($campaign->ao_type == 'click') active @endif">
                                            <input type="radio" name="ao_type" value="click" @if($campaign->ao_type == 'click') checked @endif>Click %
                                        </label>
                                        <label class="btn btn-info @if($campaign->ao_type == 'optin') active @endif">
                                            <input type="radio" name="ao_type" value="optin" @if($campaign->ao_type == 'optin') checked @endif>Optin %
                                        </label>
                                        <label class="btn btn-info @if($campaign->ao_type == 'conversion') active @endif">
                                            <input type="radio" name="ao_type" value="conversion" checked="" @if($campaign->ao_type == 'conversion') checked @endif>Conversion %
                                        </label>
                                    </div>
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group">
                                    <div class="make-switch">
                                        {!! Form::checkbox('enable_return_redirect', 1 ,$campaign->enable_return_redirect ,[ 'id'=>'enable_return_redirect','class' => 'probeProbe3']) !!}
                                        <div class="switchTitleSub">Enable Redirect For<br>Return Visitors</div>
                                    </div>
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group returnVisitors_div" @if(!$campaign->enable_return_redirect) style="display: none;" @endif>
                                    <div class="numboxTitle">
                                        <span>Redirect After</span>
                                        <br>
                                        Number of visits
                                        <i id="infoIcon2" class="glyphicon glyphicon-info-sign" rel="tooltip2" title="Redirect return user after X numbers of visits"></i>
                                    </div>
                                    <div class="input-group">
                                       {!! Form::select('redirect_return_after',['1'=>'1','2'=>'2','3'=>'3'],$campaign->redirect_return_after ,[ 'placeholder'=>'Select','id'=>'redirect_return_after','class'=>'form-control']) !!}
                                    </div>
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group returnVisitors_div" @if(!$campaign->enable_return_redirect) style="display: none;" @endif>
                                    <div class="uelboxTitle">
                                        <span>Redirect Return User Url</span>
                                        <br>
                                        Set the url
                                        <i id="infoIcon3" class="glyphicon glyphicon-info-sign" rel="tooltip3" title="Set the url where user will be redirected"></i>
                                    </div>
                                    {!! Form::input('url','redirect_return_url',$campaign->redirect_return_url ,[ 'placeholder'=>'Redirect Url','id'=>'redirect_return_url','class'=>'form-control']) !!}
                                </div>
                                <!-- ********************************** -->
                                <!-- <button type="submit" class="btn btn-lg btn-warning">Submit</button> -->
                            </form>

                        </div>

                        <!-- ************* SEO & Social TAB *********** -->
                        <div id="SeoSocial" class="tab-pane fade">

                            <form id="seo-form" enctype="multipart/form-data">
                                <!-- ********************************** -->
                                <div class="form-group">
                                    {!! Form::text('title',$seo->title ,['placeholder'=>'Page title','id'=>'PageTitle','class'=>'form-control']) !!}
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group">
                                    {!! Form::text('author',$seo->author ,['placeholder'=>'Page Author','id'=>'PageAuthor','class'=>'form-control']) !!}
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group">
                                    <div class="txtTitle">
                                        Keywords
                                        <i id="infoIcon4" class="glyphicon glyphicon-info-sign" rel="tooltip4" title="any info about Analytics and Retargeting code"></i>
                                    </div>
                                    <textarea name="keywords" class="form-control" id="KeywordsField" rows="6.5">{{$seo->keywords}}</textarea>
                                </div>
                                <!-- ********************************** -->
                                <div class="form-group">
                                    <div class="txtTitle">
                                        Description
                                        <i id="infoIcon5" class="glyphicon glyphicon-info-sign" rel="tooltip5" title="any info about Analytics and Retargeting code"></i>
                                    </div>
                                    <textarea name="description" class="form-control" id="DescriptionField" rows="6.5">{{$seo->description}}</textarea>
                                </div>
                                <!-- ********************************** -->
                                <div class="uploadImgBtn col-md-6">
                                    Upload image for thumbnail
                                </div>
                                <input type="file" id="fileSeo" name="images" style="display: none">
                                <div class="col-md-6">
                                    <output id="listSeo" class="SelectedSeo">
                                        @if($seo->seo_image)
                                            <span class="glyphicon glyphicon-remove" id="remove-seo-image"></span>
                                            <span class="imageContainerSeo">
                                                <img class="thumb" width="170" src="{{'/v2/images/uploads/'.$seo->seo_image}}" title="3.gif">
                                            </span>
                                        @endif
                                    </output>
                                </div>

                                <!-- ********************************** -->
                                <div class="col-md-12">
                                    <!-- <button type="submit" class="btn btn-lg btn-warning">Save</button> -->
                                </div>
                            </form>

                        </div>
                    </div>

                </div>

            </div>

            <!-- Settings Section 3 Components-->
            <div id='mdprt3' class="col-md-8 middlePart hidden">
                <div class='close-window pull-right'><i class="glyphicon glyphicon-remove"></i></div>

                <!-- Components -->
                <div class="cmpntTheme">

                    <div id="draggableCmpnt1">
                        <div class="col-md-12 mng">
                            <p class="cmp1Style1">Many carefully crefted components</p>
                            <p class="cmp1Style2">to present your business.</p>
                            <p class="cmp1Style3">Watch your video.</p>
                        </div>
                    </div>

                    <div id="draggableCmpnt2">
                        <div class="col-md-12 mng">
                            <p class="cmp2Style1">Reduce the amount of</p>
                            <p class="cmp2Style2">time to build your ads by</p>
                            <p class="cmp2Style3">300%</p>
                        </div>
                    </div>

                    <div id="draggableCmpnt3">
                        <div class="col-md-12 mng">
                            <p class="cmp3Style1">Built to impress</p>
                            <div style="padding: 0 5% 0 10%">
                                <p class="cmp3Style2">Build quick</p>
                                <p class="cmp3Style3">Get butiful site up and running in no</p>
                                <p class="cmp3Style4">time. Just choose component you like and</p>
                                <p class="cmp3Style5">start tweaking it.</p>
                                <p class="cmp3Style6">Instructions manual</p>
                                <p class="cmp3Style7">Get started immediately with clear setup</p>
                                <p class="cmp3Style8">instructions and a comprehensive help</p>
                                <p class="cmp3Style9">guide with useful examples.</p>
                            </div>
                        </div>
                    </div>

                    <div id="draggableCmpnt4">
                        <div class="col-md-12 mng">
                            <p class="cmp4Style1">GET YOUR COPY TODAY</p>
                            <p class="cmp4Style2">Subscribe</p>
                        </div>
                    </div>

                    <div id="draggableCmpnt5">
                        <div class="col-md-12 mng">
                            <p class="cmp5Style1">Generate leads and sales with us</p>
                        </div>
                    </div>

                </div>

            </div>

        </div>
<!-- ************************************************************************************************************* -->
        <!-- Right Part -->
        <div class="col-md-6 rightPart">

            <div class="col-md-10 spbtw text-center" id="vdDroppable">
                <!-- <span>Auto Save</span> -->
            </div>

            <div class="col-xs-12 col-md-10 rightView" id="droppable" data-value="charactersBlockBg">

                @if($campaign->id > 0)
                    {!!$template->body!!}
                @else
                <div class="mngView">
                    <div class="mntitl">
                        Drag & Drop Elements here
                    </div>

                    <div class="col-xs-12 col-md-8 col-md-offset-4 mnatr">
                        <dl>
                            <dt><img src="/v2/img/icon-dash.png" alt="" width="18"><a>Components</a></dt>
                            <dt class="padicon"><img src="/v2/img/icon-h.png" alt="" height="15"><a>Headline</a></dt>
                            <dt><img src="/v2/img/icon-line.png" alt="" width="18"><a>Text</a></dt>
                            <dt><img src="/v2/img/icon-mount.png" alt="" width="18"><a>Image</a></dt>
                            <dt><img src="/v2/img/icon-envelope.png" alt="" width="18"><a>Mail To Box</a></dt>
                            <dt><img src="/v2/img/icon-video.png" alt="" width="18"><a>Video</a></dt>
                        </dl>
                    </div>
                </div>
                @endif

            </div>
        </div>
    </div>
</div>

<!-- ************************************************************************************************************* -->

<!-- ************* Modal For Container ************* -->
<div id="containerModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Container Settings</h4>
            </div>

            <div class="modal-body row">

                <div class="col-md-5">
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs tabs-left sideways">
                        <li class="active"><a href="#home-v0" data-toggle="tab">Choose background image</a></li>
                        <li><a href="#profile-v0" data-toggle="tab">Choose background color</a></li>
                    </ul>
                </div>

                <div class="col-md-7">
                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div class="tab-pane active" id="home-v0">
                            Choose background image

                            <input type="file" id="filesCont" name="images" class="form-control" >
                            <output id="listCont" class="selected"></output>
                            <hr>
                            <div class="col-md-12">
                                <div class="col-md-12">
                                    <div class="col-md-6"><img class='repoIconCont' src="/v2/img/Tulips.jpg" width="100"></div>
                                    <div class="col-md-6"><img class='repoIconCont' src="/v2/img/creativity.jpg" width="100"></div>
                                </div>
                                <div class="col-md-12">
                                    <div class="col-md-6"><img class='repoIconCont' src="/v2/img/colors.jpg" width="100"></div>
                                    <div class="col-md-6"><img class='repoIconCont' src="/v2/img/bulb.jpg" width="100"></div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane" id="profile-v0">
                            Choose background color

                            <div id="colorpickerHolderContainer"></div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-lg btn-warning" onclick="selectContElem(this)">Save</button>
            </div>
        </div>

    </div>
</div>

<!-- ************* Modal For Upload Image ************* -->
<div id="imageModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Image Settings</h4>
            </div>

            <div class="modal-body row">

                <div class="col-md-5">
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs tabs-left sideways">
                        <li class="active"><a href="#home-v1" data-toggle="tab">Choose background image</a></li>
                        <li><a href="#profile-v1" data-toggle="tab">Choose background color</a></li>
                    </ul>
                </div>

                <div class="col-md-7">
                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div class="tab-pane active" id="home-v1">
                            Choose background image

                            <input type="file" id="files" name="images" class="form-control" >
                            <output id="list" class="selected"></output>
                            <hr>
                            <div class="col-md-12">
                                <div class="col-md-12">
                                    <div class="col-md-6"><img class='repoImg' src="/v2/img/Tulips.jpg" width="100"></div>
                                    <div class="col-md-6"><img class='repoImg' src="/v2/img/creativity.jpg" width="100"></div>
                                </div>
                                <div class="col-md-12">
                                    <div class="col-md-6"><img class='repoImg' src="/v2/img/colors.jpg" width="100"></div>
                                    <div class="col-md-6"><img class='repoImg' src="/v2/img/bulb.jpg" width="100"></div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane" id="profile-v1">
                            Choose background color

                            <div id="colorpickerHolder"></div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-lg btn-warning" onclick="selectImgElem(this)">Save</button>
            </div>
        </div>

    </div>
</div>

<!-- ************* Modal For Upload Video ************* -->
<div id="videoModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Video Settings</h4>
            </div>
            <div class="modal-body row">
                <div class="col-md-5">

                </div>

                <div class="col-md-7">
                    Insert Video embed code

                    <textarea id="uploadedVideo" rows="10" cols="35" name="text"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-lg btn-warning" onclick="selectVideoElem(this)">Save</button>
            </div>
        </div>

    </div>
</div>

<!-- ************* Modal For Mail Box ************* -->
<div id="mailModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Mail Box Settings</h4>
            </div>
            <div class="modal-body row">

                <div class="col-md-5">
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs tabs-left sideways">
                        <li class="active"><a href="#home-v3" data-toggle="tab">Choose color of text</a></li>
                        <li><a href="#profile-v3" data-toggle="tab">Choose background color</a></li>
                        <li><a href="#profile-t3" data-toggle="tab">Insert text of button</a></li>
                        <li><a href="#profile-s3" data-toggle="tab">Insert style of button</a></li>
                        <li><a href="#profile-i3" data-toggle="tab">Choose icon of button</a></li>
                    </ul>
                </div>

                <div class="col-md-7">
                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div class="tab-pane active" id="home-v3">
                            Choose color of text

                            <div id="colorpickerHolderMailText"></div>
                        </div>

                        <div class="tab-pane" id="profile-v3">
                            Choose background color

                            <div id="colorpickerHolderMailBg"></div>
                        </div>

                        <div class="tab-pane" id="profile-t3">
                            Insert text of button and size of text

                            <div id="emailBoxTxtStyle" class="col-md-12">
                                <div class="form-group">
                                    <label>Text of button</label>
                                    <input id="emailBoxBtnText" class="form-control input-lg" type="text" placeholder="Type Text of Button" />
                                </div>
                                <div class="form-group">
                                    <label>Size of text</label>
                                    <select id="emailBoxBtnFont" class="form-control input-lg">
                                        <option value="8">8</option>
                                        <option value="10">10</option>
                                        <option value="12">12</option>
                                        <option value="14">14</option>
                                        <option value="16">16</option>
                                        <option value="18">18</option>
                                        <option value="20">20</option>
                                        <option value="22">22</option>
                                        <option value="24">24</option>
                                        <option value="26">26</option>
                                        <option value="28">28</option>
                                    </select>
                                </div>
                                <div class="col-md-6" style="padding-left: 0px">
                                    <label>Text width Padding</label>
                                    <input class="txtStyleW form-control input-lg" type="number" min="10" max="100"/>
                                </div>
                                <div class="col-md-6" style="padding-right: 0px">
                                    <label>Text height Padding</label>
                                    <input class="txtStyleH form-control input-lg" type="number" min="10" max="100"/>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane" id="profile-s3">
                            Insert style of button

                            <div id="emailBoxBtnStyle" class="col-md-12">
                                <div class="form-group col-md-6">
                                    <label>Padding width</label>
                                    <input class="btnStyleW form-control input-lg" type="number" min="0" max="50"/>
                                </div>
                                <div class="form-group col-md-6">
                                    <label>Padding height</label>
                                    <input class="btnStyleH form-control input-lg" type="number" min="0" max="50"/>
                                </div>
                                <div class="form-group col-md-12">
                                    <label>Corner Radius</label>
                                    <select class="btnStyleR form-control input-lg">
                                        <option value="rounded">Rounded</option>
                                        <option value="square">Square</option>
                                        <option value="pill">Pill</option>
                                        <option value="dotted">Dotted Border</option>
                                        <option value="dashed">Dashed Border</option>
                                        <option value="groove">Groove Border</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-12">
                                    <label>Button Position</label>
                                    <select class="btnStyleP form-control input-lg">
                                        <option value="center">Center</option>
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane" id="profile-i3">
                            Choose icon of button

                            <div id="emailBoxBtnIcon">
                                <div class="col-md-12">
                                    <div class="col-md-12">
                                        <div class="col-md-6"><img class='repoIcon' src="/v2/img/Tulips.jpg" width="100"></div>
                                        <div class="col-md-6"><img class='repoIcon' src="/v2/img/creativity.jpg" width="100"></div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="col-md-6"><img class='repoIcon' src="/v2/img/colors.jpg" width="100"></div>
                                        <div class="col-md-6"><img class='repoIcon' src="/v2/img/bulb.jpg" width="100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <input id="emailBoxInput" type="hidden" placeholder="Type email here" />
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-lg btn-warning" onclick="selectMailBoxElem(this)">Save</button>
            </div>
        </div>

    </div>
</div>

<!-- ************* Modal For Caution ************* -->
<div id="cautionModal" class="modal fade" role="dialog">
    <div class="modal-dialog">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-body row">
                <div class="alert col-md-8 col-md-offset-2">

                </div>
            </div>
            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-warning" onclick="delSureElem('YES')">YES</button>
                <button type="button" data-dismiss="modal" class="btn btn-warning" onclick="delSureElem('NO')">NO</button>
            </div>
        </div>

    </div>
</div>

<!-- jQuery -->
<script type='text/javascript' src="/v2/js/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="/v2/js/bootstrap.min.js"></script>
<script src="/v2/js/bootstrap-switch.min.js"></script>
<script src="/v2/js/jquery.nicescroll.min.js"></script>
<script src="/v2/js/jquery-ui.js"></script>
<script src="/v2/js/colorpicker.js"></script>
<script src="/v2/js/ckeditor/ckeditor.js?=hxfgjhxfgjxfgjxcfgj"></script>
<script src="/js/jquery.validate.min.js"></script>

<!-- Custom JS -->
<script src="/v2/js/custom.js"></script>
<script src="/v2/js/custom_drag_drop.js"></script>
<script src="/js/bootstrap-dialog.js"></script>
<script src="https://rawgit.com/makeusabrew/bootbox/f3a04a57877cab071738de558581fbc91812dce9/bootbox.js"></script>
<script type="text/javascript">

    $(document).on('ready',function(){
        $.current_variation_id = {{$template->id}};
        $.campaign_id = {{$campaign->id}};
        $.save = true;
        @if($campaign->id == 0) 
            $.active_window = '';
        @else
            $.active_window = 'variation';
        @endif  
        if($.campaign_id > 0) {
            $(".rightView").niceScroll({
                cursorcolor:"#a6a6a6",
                cursorwidth: "8px",
                autohidemode: "leave",
                cursorminheight: 10,
                cursorborder: 'none',
                railpadding: { top: 0, right: 2, left: 0, bottom: 0 }
            });

           setTimeout(function(){
                $('#droppable').removeAttr('style');
                $('#droppable').attr('style', "overflow: hidden; outline: none; padding: 0px; background: rgb(249, 248, 248);");
           },50)
            
        }
    });
</script>
</body>
</html>
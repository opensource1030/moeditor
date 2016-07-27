<div id='mdprt2' class="col-md-8 middlePart hidden">

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
                        {!! Form::text('name',$campaign->name ,['placeholder'=>'Campaign name','id'=>'name','class'=>'form-control']) !!}
                    </div>
                    <!-- ********************************** -->
                    <div class="form-group">
                        {!! Form::text('slug',$campaign->slug ,['placeholder'=>'Campaign URL','id'=>'slug','class'=>'form-control']) !!}
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
                    <div class="form-group analitAndRetarget_div">
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
                            {{-- <input type="checkbox" checked="true" class="probeProbe2" /> --}}
                            {!! Form::checkbox('enable_optimization', 1 ,$campaign->enable_optimization ,[ 'id'=>'enable_optimization','class' => 'probeProbe2']) !!}
                            <div class="switchTitle">Enable Optimization</div>
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
                    <div class="form-group returnVisitors_div">
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
                    <div class="form-group returnVisitors_div">
                        <div class="uelboxTitle">
                            <span>Redirect Return User Url</span>
                            <br>
                            Set the url
                            <i id="infoIcon3" class="glyphicon glyphicon-info-sign" rel="tooltip3" title="Set the url where user will be redirected"></i>
                        </div>
                        {{-- <input type="url" name="RedirectReturnUserUrl" class="form-control" placeholder="Redirect URL"/> --}}
                        {!! Form::input('url','redirect_return_url',$campaign->redirect_return_url ,[ 'placeholder'=>'Redirect Url','id'=>'redirect_return_url','class'=>'form-control']) !!}
                    </div>
                    <!-- ********************************** -->
                    <button type="submit" class="btn btn-lg btn-warning">Submit</button>
                </form>

            </div>

            <!-- ************* SEO & Social TAB *********** -->
            <div id="SeoSocial" class="tab-pane fade">
                
                <form id="seo-form">
                    <!-- ********************************** -->
                    <div class="form-group">
                        <div class="numboxTitle">
                            <span>Traffic Allocation</span>
                        </div>
                        <div class="input-group">
                            <input type="text" class="form-control" id="TrafficAllocation" />
                            <div class="input-group-btn-vertical">
                                <button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button>
                                <button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button>
                            </div>
                        </div>
                    </div>
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
                    <div class="uploadImgBtn" data-toggle="modal" data-target="#themeModal">
                        Upload image for thumbnail
                    </div>
                    <!-- ********************************** -->

                    <button type="submit" class="btn btn-lg btn-warning">Save</button>
                </form>

            </div>
        </div>

    </div>

</div>
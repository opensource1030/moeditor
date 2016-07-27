<div id='mdprt1' class="col-md-8 middlePart hidden variations">

    <!-- Variation Settings Section -->
    <div class="varSetSec">
        <div class="titleMiddlePart">Variation 1 Settings</div>

        <form id="variation-form">
            <div class="form-group">
                {!! Form::text('template_name',$template->template_name ,['placeholder'=>'Variation (Name)','id'=>'VariationName','class'=>'form-control']) !!}
            </div>
            <div class="form-group inner-addon right-addon">
                <i class="glyphicon glyphicon-info-sign" rel="tooltip6" title="While this is not a required field, if you do have a terms of service page you can link to it here. It will show up on the bottom of your newly created optin page"></i>
                {!! Form::text('therms_link',$template->therms_link ,['placeholder'=>'Terms of service URL','id'=>'TermsOfServiceURL','class'=>'form-control']) !!}
            </div>
            <div class="form-group inner-addon right-addon">
                <i class="glyphicon glyphicon-info-sign" rel="tooltip7" title="While this is not a required field, if you do have a terms of service page you can link to it here. It will show up on the bottom of your newly created optin page"></i>
                {!! Form::text('privacy_link',$template->privacy_link ,['placeholder'=>'Privacy policy URL','id'=>'PrivacyPolicyURL','class'=>'form-control']) !!}
            </div>
            <div class="form-group inner-addon right-addon">
                <i class="glyphicon glyphicon-info-sign" rel="tooltip8" title="You may enter mailto:youremailaddress or enter a URL for your contact information here. If you do not wish to provide this you can leave this box blank"></i>
                {!! Form::text('contact_link',$template->contact_link ,['placeholder'=>'Contact Us URL','id'=>'ContactUsURL','class'=>'form-control']) !!}
            </div>
            <div class="form-group">
                <!--input type="number" class="form-control" id="ChooseIntegration" placeholder="Choose Integration"-->
                <div class="input-group">
                    <select name="contact_type" id="contact_type" class="form-control" @if(!in_array('integrations', $access_permissions)) disabled @endif>
                       <option value="0" data-type-id="0">Manual</option>
                           @foreach($user_integrations as $type)
                              <option value="{{ $type->id }}" data-type-id="{{ $type->type_id }}">{{ $type->name }}</option>
                           @endforeach
                       </select>
                   {{--  <select class="form-control">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                    <input type="text" class="form-control" id="ChooseIntegration" placeholder="Choose Integration">
                    <div class="input-group-btn-vertical">
                        <button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button>
                        <button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button>
                    </div> --}}
                </div>
            </div>
            <div class="form-group">
                {!! Form::select('integration_id', $integrations ,'0',['id'=>'integration_id','class'=>'form-control'])   !!}
                <div id="aweber-note" class='alert alert-warning hide'>
                    <strong>IMPORTANT!</strong>  Single optin is not turned on by default for Aweber.  
                    In order to enable single optin for your lists you MUST contact Aweber support and ask them to enable single optin for each of your lists.
                </div>
            </div>
            <div class="form-group">
                {!! Form::text('notification_email',$template->notification_email ,['placeholder'=>'Notification Email','id'=>'NotificationEmail','class'=>'form-control']) !!}
            </div>
            <div class="form-group">
                {!! Form::text('redirect_after',$template->redirect_after ,['placeholder'=>'Redirect after optin','id'=>'RedirectAfterOptin','class'=>'form-control']) !!}
            </div>
            <div class="form-group">
                {!! Form::text('email_subject',$template->email_subject ,['placeholder'=>'Return Email subject','id'=>'ReturnEmailSubject','class'=>'form-control']) !!}
            </div>
            <div class="form-group">
                <textarea class="form-control" name="template_return_email_content" id="ReturnEmailBody" placeholder="Return Email body" rows="6.5">{{$template->template_return_email_content}}</textarea>
            </div>

            <button type="submit" class="btn btn-lg btn-warning" id="variation-save">Save Changes</button>
        </form>
    </div>

</div>
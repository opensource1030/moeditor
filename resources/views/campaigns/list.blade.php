@extends('layouts/main')

@section('content')

<div class="row">
    <div class="col-md-6 ">
        <h1 class="category_header">Campaigns</h1>
    </div>
    <div class="col-md-4 text-right pt-3">
        <div id="campaings_range" class="campaings_range pull-right">
            <i class="glyphicon glyphicon-calendar"></i>
            <span><?php echo date("F j, Y"); ?> - <?php echo date("F j, Y"); ?></span>
            <input type="hidden" id="filter_start_date" value="{{date('d-m-Y')}}">
            <input type="hidden" id="filter_end_date" value="{{date('d-m-Y')}}">
            <b class="caret"></b>
        </div>
    </div>
    <div class="col-md-2 text-right pt-26">
        @if(Auth::user()->can('manage_campaign'))
        <a href="{{ route('add_campaigns')  }}" class="btn btn-green"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Create Campaign</a>
        @endif

    </div>
</div>
<div class="row">
    <div class="col-md-12 ">
        <div class="table-responsive">
            <table id="campaign_table" class="table   table-curved list_options">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Integrations</th>
                        <th>Status</th>
                        <th>Visitors</th>
                        @if(Auth::user()->can('manage_campaign'))
                        <th class="col-sm-2">Actions</th>
                        @endif
                        <th class=" slide_table_column"> Campaign details</th>
                    </tr>
                </thead>
                <tbody data-link="row">
                    <?php 
                    $i = 0;
                    $countc = count($campaigns->items());
                    if($countc % 10  != 0){
                        $mod = $countc % 10;
                        $cc = 10 - $mod;
                        
                        for ($index = 0; $index < $cc; $index++) {
                            $campaigns[] = new MobileOptin\Models\Campaigns;
                        }
                    }
                    
                    ?>

                    @foreach($campaigns as $campaign)
                    @if($campaign->id == '')
                    <tr style='display: none;' id='hidden_row'>
                        <td  ><span style='height: 60px;' class="campaign_name"></span></td>
                         <td ><span style='height: 60px;' class="campaign_name"></span></td>
                          <td ><span style='height: 60px;' class="campaign_name"></span></td>
                           <td ><span style='height: 60px;' class="campaign_name"></span></td>
                            <td ><span style='height: 60px;' class="campaign_name"></span></td>
                    </tr>
                    @else
                    <tr data-campaign_id="{{$campaign->id}}">

                        <td ><span class="campaign_name" @if($campaign->v2) style='color:red' @endif>{{ $campaign->name }}</span>


                            <div class="row campaign_info">
                                <div class="col-md-6">
                                    <strong>Created</strong>
                                </div>
                                <div class="col-md-6 ">
                                    {{date('F d,Y',strtotime($campaign->created_at))}}
                                </div>
                            </div>
                            <div class="row campaign_info">
                                <div class="col-md-6">
                                    <strong>Updated</strong>
                                </div>
                                <div class="col-md-6 ">
                                    {{date('F d,Y',strtotime($campaign->updated_at))}}
                                </div>
                            </div>
                        </td>

                        <td class="rowlink-skip " align="center">
                            <div class="embed_btn_holder">
                                <div class="or_circle">
                                    or
                                </div>

                                <button type="button" data-custom_url="<?php echo is_object($campaign->domain) ? $campaign->domain->name : '' ?>" data-campaing_url="{{ route('campaign_link',['campaign_id'=> $campaign->id ,'campaing_name'=>$campaign->slug])  }}" class="show_embed_code btn
                                        @if($has_embed)
                                        btn-embedCode
                                        @else
                                        btn-embedCode
                                        @endif
                                        btn-sm" data-toggle="modal" data-target="#myModal"
                                        @if(!$has_embed)
                                        disabled="disabled"
                                        @endif
                                        >
                                        Embed code
                            </button>

                            <button type="button" data-custom_url="<?php echo is_object($campaign->domain) ? $campaign->domain->name : '' ?>" data-campaing_url="{{ route('campaign_link',['campaign_id'=> $campaign->id ,'campaing_name'=>$campaign->slug])  }}" class="show_hosted_url btn  @if($has_hosted)
                                    btn-embedCode
                                    @else
                                    btn-embedCode
                                    @endif btn-sm" data-toggle="modal" data-target="#hostedModal"
                                    @if(!$has_hosted)
                                    disabled="disabled"
                                    @endif
                                    >
                                    hosted url
                        </button>
                    </div>
                </td>
                <td align="center">
                    <span class="light_gray">{{ $campaign->active ? 'Active' : 'Disabled' }}</span></td>
                <td align="center"><span class="dark_gray total_number_of_variation_for_campaign"><?php
                        $totalvisits = 0;
                        if (isset($splitTestStats[$campaign->id])) {
                            foreach ($splitTestStats[$campaign->id] as $tmp_id => $twe) {
                                if(isset($twe['total_unique'])){
                                $totalvisits += $twe['total_unique'];
                                }else{
                                     $totalvisits += 0;
                                }
                            }
                        }
                        ?>

                        {{$totalvisits}}
                    </span>
                </td>
                @if(Auth::user()->can('manage_campaign'))
                <td class="rowlink-skip">
                    <ul class="nav nav-pills">
                        <li role="presentation" class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                <span class="text">Action</span>
                                <div class="iconholder">
                                    <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
                                </div>
                            </a>
                            <ul class="dropdown-menu">
                                @if($campaign->v2)
                                    <li>
                                        <a href="{{ url('v2/campaigns/'.$campaign->id.'/edit')  }}">Edit</a>
                                    </li>
                                @else
                                    <li>
                                        <a href="{{ route('edit_campaigns',['id'=> $campaign->id])  }}">Edit</a>
                                    </li>
                                @endif
                                <li>
                                    @if($campaign->active)
                                    <a href="{{ route('change_status_campaigns',['id'=> $campaign->id ,'status'=>0])  }}">Disable</a>
                                    @else
                                    <a href="{{ route('change_status_campaigns',['id'=> $campaign->id ,'status'=>1])  }}">Enable</a>
                                    @endif
                                </li>
                                <li>
                                    @if(Auth::user()->getOwner() == false)
                                    <a onclick="return confirm(' you want to delete?');" href="{{ route('delete_campaigns',['id'=> $campaign->id])  }}">Delete</a>
                                    @endif
                                </li>
                                <li>
                                    @if(Auth::user()->getOwner() == false)
                                    <a href="{{ route('campaigns_assinged',['id'=> $campaign->id])  }}">Assigned Users</a>
                                    @endif
                                </li>
                            </ul>
                        </li>
                    </ul>

                </td>
                @endif
                @if($i==0)
                <td class="rowlink-skip slide_table_column"  rowspan="{{count($campaigns->items())}}">
                    <div class="stats_holder">
                        <div class="howtousecampaignlist">
                            <img src="{{url('img/green_arrow.png')}}" width="60" height="73">
                            </br>
                            Click on title of the campaign to view quick stats
                        </div>
                    </div>
                </td>
                <?php $i = 1 ?>

                @endif
            </tr>
            @endif
            @endforeach
        </tbody>
        <tfoot>
        <th class='text-right' colspan="6"><?php echo $campaigns->render(); ?></th>
        </tfoot>
    </table>


</div>
</div>
</div>


<div style="display: none;">

    @foreach($campaigns as $campaign)
    <div id="stats_for_campaign_id_{{$campaign->id}}">
        <div style="overflow-y: scroll; overflow-x: hidden; max-height: 100rem !important;">

        <div class="row">
            <div class="col-md-12 ">
                <div class="pd-5">
                    <a onclick="return confirm('Are you sure you want to reset your stats? This cannot be undone');" href="{{route('reset_stats',['campaign_id'=>$campaign->id])}}" class="btn btn-reset_stats  ">Reset Stats</a>
                    <a href="{{route('extended_testing_results',['campaign_id'=>$campaign->id])}}" class="btn btn-extended_stats pull-right">Detailed Stats</a>

                </div>

            </div>
        </div>
        <br/>
        <br/>
        <?php
        $total_campaing_optins = 0;
        $total_campaing_clicks = 0;
        $total_campaing_visitors = 0;
        $wfo = '';
        $overall = '';
        $array_of_ids_templates = [];
        if (isset($splitTestStats[$campaign->id]))
            foreach ($splitTestStats[$campaign->id] as $tmp_id => $twe) {
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

                        $wfo .= ' <div class="stats_for_t">
                            <h5 class="template_title_qs">Variation: ( ' . $name . ' ) - Disabled</h5>

                            <div class="row">
                                <div class="col-xs-4">
                                    <span class="sttitle">Visitors</span>
                                    ' . $total_unique . '
                                </div>
                                <div class="col-xs-4">
                                    <span class="sttitle">Clicks</span>
                                    ' . $total_clicks . '
                                </div>
                                <div class="col-xs-4">
                                    <span class="sttitle">Optins</span>
                                    ' . $total_optins . '
                                </div>
                            </div>
                            <div class="row">
                                <span class="tmp_percentage">
                                    Conversion: ' . $optin_percentage . '
                                </span>
                            </div>
                        </div>';
                    } else {
                        $wfo .= ' <div class="stats_for_t">
                            <h5 class="template_title_qs">Variation: ( ' . $name . ' ) - ' . $afp . ' % </h5>

                            <div class="row">
                                <div class="col-xs-4">
                                    <span class="sttitle">Visitors</span>
                                    ' . $total_unique . '
                                </div>
                                <div class="col-xs-4">
                                    <span class="sttitle">Clicks</span>
                                    ' . $total_clicks . '
                                </div>
                                <div class="col-xs-4">
                                    <span class="sttitle">Optins</span>
                                    ' . $total_optins . '
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <span class="tmp_percentage">
                                        Conversion: ' . $optin_percentage . '
                                    </span>
                                </div>
                            </div>
                        </div>';
                    }
                    $total_campaing_clicks += $total_clicks;
                    $total_campaing_visitors += $total_unique;
                    $total_campaing_optins += $total_optins;
                
                }
            }
        foreach ($campaign->template as $tmpinfo) {
            $contact_type = $tmpinfo->contact_type == 1 ? 'Subscribers' : 'Clicks';
            if (!in_array($tmpinfo->id, $array_of_ids_templates)) {

                if ($tmpinfo->affect_percentile == 0) {
                    $wfo .= ' <div class="stats_for_t">
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
                                        Conversion: 0 %
                                    </span>
                                </div>
                            </div>
                        </div>';
                } else {
                    $wfo .= ' <div class="stats_for_t">
                            <h5 class="template_title_qs">Variation: ( ' . $tmpinfo->name . ' ) - ' . $tmpinfo->affect_percentile . ' % </h5>

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
        echo $overall . $wfo;
        ?>


    </div> </div>
    @endforeach
</div>
<style type="text/css">
.traffic-label {
    font-size: 14px; 
    padding: 0px 10px;
}
.traffic-label.label-primary {
    background:#4791e2;
}

</style>

@include('campaigns.modal.hosted')
@include('campaigns.modal.embed')

@endsection
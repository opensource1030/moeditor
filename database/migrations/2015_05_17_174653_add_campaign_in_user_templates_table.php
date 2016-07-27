<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCampaignInUserTemplatesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table( 'user_templates', function ( $table ) {
            $table->integer( 'campaign_id' );

        } );
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table( 'user_templates', function ( $table ) {
            $table->dropColumn( 'campaign_id' );
        } );
	}

}

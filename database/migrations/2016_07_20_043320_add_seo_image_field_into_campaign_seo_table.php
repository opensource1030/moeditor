<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSeoImageFieldIntoCampaignSeoTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('campaign_seo',function(Blueprint $table){
			$table->string('seo_image')->nullable()->after('description');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('campaign_seo',function(Blueprint $table){
			$table->dropColumn('seo_image');
		});
	}

}

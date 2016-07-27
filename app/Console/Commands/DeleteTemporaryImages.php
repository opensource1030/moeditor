<?php namespace MobileOptin\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use Carbon\Carbon;
use File;

class DeleteTemporaryImages extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'delete:images';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Delete temporary uploaded images';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		$destination = public_path('v2/images/uploads');
		$list_dir = scandir($destination);
		$res = [];
		foreach ($list_dir as $value) {
			if(strpos($value, 'temp') !== false) {
				$res[]=$value;
			}
		}
		$deletable = [];
		foreach ($res as $value) {
			// dd(strpos($value, '.'));
			$created_day = Carbon::createFromFormat('Y_m_d_H_i_s', substr($value, strpos($value, '-') + 1, count($value) - 5));
			$now = Carbon::now();
			$diff_in_minutes = $now->diffInMinutes($created_day);
			if($diff_in_minutes > config('session.lifetime')) {
				$deletable[] = $value;
			}
		}
		foreach ($deletable as $value) {
			File::delete($destination.'/'.$value);
		}
		
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return [
			
		];
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return [
			
		];
	}

}

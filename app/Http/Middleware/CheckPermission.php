<?php namespace MobileOptin\Http\Middleware;

use Closure;
use Illuminate\Contracts\Routing\Middleware;

class CheckPermission implements Middleware
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle( $request, Closure $next )
    {
        $segment_1 = \Request::segment(1);
        $segment_2 = \Request::segment(2);
        if($user = \Auth::user()){
            $all_ap = \DB::table('access_permissions')->lists('slug');
            $access_permissions = \DB::table('access_permissions')->whereIn('id', unserialize(\Auth::user()->access_permissions))->lists('slug');
            if(in_array($segment_1, $all_ap) || in_array($segment_1 . '/' . $segment_2, $all_ap)){
                if(!in_array($segment_1, $access_permissions) && !in_array($segment_1 . '/' . $segment_2, $access_permissions)){
                    if($segment_1 == 'home'){
                        return redirect()->route( 'campaigns' );
                    }
                    elseif($segment_1 == 'campaigns'){
                        return redirect()->route( 'profile' );
                    }
                    else{
                        return redirect()->route( 'home' );
                    }
                        
                }
            }
        }
        // if ( $this->userHasAccessTo( $request ) ) {
            view()->share( 'currentUser', $request->user() );

            return $next( $request );
        // }

        return redirect()->route( 'home' );
    }

    /*
    |--------------------------------------------------------------------------
    | Additional helper methods for the handle method
    |--------------------------------------------------------------------------
    */

    /**
     * Checks if user has access to this requested route
     *
     * @param  \Illuminate\Http\Request $request
     * @return Boolean true if has permission otherwise false
     */
    protected function userHasAccessTo( $request )
    {
        return $this->hasPermission( $request );
    }

    /**
     * hasPermission Check if user has requested route permimssion
     *
     * @param  \Illuminate\Http\Request $request
     * @return Boolean true if has permission otherwise false
     */
    protected function hasPermission( $request )
    {
        $required = $this->requiredPermission( $request );

        return !$this->forbiddenRoute( $request ) && $request->user()->can( $required );
    }

    /**
     * Extract required permission from requested route
     *
     * @param  \Illuminate\Http\Request $request
     * @return String permission_slug connected to the Route
     */
    protected function requiredPermission( $request )
    {
        $action = $request->route()->getAction();
        if ( isset( $action[ 'permission' ] ) ) {
            if ( is_array( $action[ 'permission' ] ) ) {
                return $action[ 'permission' ];
            } else {
                return explode( '|', $action[ 'permission' ] );
            }
        } else {
            return null;
        }

    }

    /**
     * Check if current route is hidden to current user role
     *
     * @param  \Illuminate\Http\Request $request
     * @return Boolean true/false
     */
    protected function forbiddenRoute( $request )
    {
        $action = $request->route()->getAction();

        if ( isset( $action[ 'except' ] ) ) {

            return $action[ 'except' ] == $request->user()->role->role_slug;
        }

        return false;
    }
}
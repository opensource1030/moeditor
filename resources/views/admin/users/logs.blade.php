@extends('layouts/main')

@section('content')
    <div class="row">
        <div class="col-md-6 ">
            <h1 class="category_header">Logs</h1>
        </div>
        <div class="col-md-3 text-right pt-26">
            <form class="form-inline" role="form"">
                <input class="form-control input-sm" type="text" name="search_email" placeholder="enter user email">
                <button type="submit" class="btn btn-default btn-sm">Search</button>
            </form>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12 ">
            <div class="table-responsive">
                <table class="table   table-curved list_options">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>IP</th>
                        <th>Time</th>
                        <th>Country</th>
                        <th>City</th>
                        <th>Account</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($users as $user)
                        <?php $user_i = json_decode(unserialize($user->user_info)); ?>
                        <tr data-link="row" class="rowlink usrmngrow">
                            <td>{{ $user->users->id }}</td>
                            <td>{{ $user->users->email }}</td>
                            <td> {{ $user->ip }}</td>
                            <td>
                                {{ date('m-d-Y H:i:s',strtotime($user->created_at)) }}
                            </td>
                            <td>{{ $user_i->country }}</td>
                            <td>{{ $user_i->city }}</td>
                            <td>{{ ($user->users->id == $id)?'Owner':'Subuser' }}</td>
                        </tr>
                    @endforeach
                    </tbody>
                    <tfoot>
                        <th class='text-right' colspan="7"><?php echo $users->render(); ?></th>
                    </tfoot>
                </table>
            </div>

        </div>
    </div>



@endsection
<?php

namespace App\Api\V1\Controllers;

use App\Api\V1\Requests\SignUpRequest;
use App\Api\V1\Requests\UpdateUserRequest;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AdminController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('jwt.auth', []);
        $this->middleware(['role:Founder','permission:manage_users']);

    }

    public function index(Request $request)
    {
        $query = $request->get('query');
        $query = str_replace(" ", "%", $query);
        $sort_by = $request->get('sortby') ? $request->get('sortby') : 'id';
        $sort_type = $request->get('sorttype') ? $request->get('sorttype') : 'desc';
        $data = User::query()
            ->orderBy($sort_by, $sort_type)
            ->where('name', 'like', '%'.$query.'%')
            ->orWhere('email', 'like', '%'.$query.'%')
            ->paginate($request->query('size') ? $request->query('size') : 30, ['*'], 'pageIndex', $request->has('pageIndex') ? ($request->pageIndex + 1) : 1)->toArray();

        return response()->json($data);
    }
    
    // create user
    public function create(SignUpRequest $request)
    {

        $user = new User($request->all());
        if(!$user->save()) {
            throw new HttpException(500);
        }

        return response()->json([
            'status' => 'ok',
            'data' => ['success' => true, 'message' => 'user has been create']
        ], 201);
       
    }

    // update user
    public function update(UpdateUserRequest $request)
    {
        $user = User::find($request->user_id);
        if (!$user ) {
            return response()->json(["error" => ["message" => "User not exsit"]]);
        }
        $save = $user->update($request->all());;

        if(!$save) {
            throw new HttpException(500);
        }
        
        return response()->json([
            'status' => 'ok',
            'data' => ['success' => true, 'message' => 'user has been updated', 'user' => $user]]);
       
    }
    // delete contact by id
    public function destroy(Request $request)
    {   $user = User::find($request->user_id);
        if (!$user ) {
            return response()->json(["error" => ["message" => "User not exsit"]]);
        }
        $user->delete();
        return response()->json([
            'status' => 'ok',
            'data' => ['success' => true, 'message' => 'user has been deleted']]);
    }
    // search, filter and sorting contacts
    function fetch_data(Request $request)
    {
        $query = $request->get('query');
        $query = str_replace(" ", "%", $query);
        $sort_by = $request->get('sortby') ? $request->get('sortby') : 'id';
        $sort_type = $request->get('sorttype') ? $request->get('sorttype') : 'desc';
        $data = User::query()
            ->orderBy($sort_by, $sort_type)
            ->where('name', 'like', '%'.$query.'%')
            ->orWhere('email', 'like', '%'.$query.'%')
            ->paginate($request->query('size') ? $request->query('size') : 30, ['*'], 'pageIndex', $request->has('pageIndex') ? ($request->pageIndex + 1) : 1)->toArray();

        return response()->json($data);
    }
}
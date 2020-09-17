<?php

namespace App\Api\V1\Controllers;

use App\Api\V1\Requests\PostRequest;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;
use Auth;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PostController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.auth', []);
    }

    public function index(Request $request)
    {
 
        $user = Auth::guard()->user();
        $this->authorize('index', $user);
        $query = $request->get('query');
        $query = str_replace(" ", "%", $query);
        $sort_by = $request->get('sortby') ? $request->get('sortby') : 'id';
        $sort_type = $request->get('sorttype') ? $request->get('sorttype') : 'desc';
        $posts = Post::query()
            ->orderBy($sort_by, $sort_type)
            ->where('title', 'like', '%' . $query . '%')
            ->orWhere('body', 'like', '%' . $query . '%')
            ->with('user')
            ->paginate($request->query('size') ? $request->query('size') : 30, ['*'], 'pageIndex', $request->has('pageIndex') ? ($request->pageIndex + 1) : 1)->toArray();
        return response()->json($posts);
    }

    public function show(Request $request)
    {   
        $user = Auth::guard()->user();
        $query = $request->get('query');
        $query = str_replace(" ", "%", $query);
        $sort_by = $request->get('sortby') ? $request->get('sortby') : 'id';
        $sort_type = $request->get('sorttype') ? $request->get('sorttype') : 'desc';
        $posts = Post::where('user_id', $user->id)
                ->where(function ($result) use ($query) {
                $result->where('title', 'like', '%' . $query . '%')
                        ->orWhere('body', 'like', '%' . $query . '%');
            })
            ->orderBy($sort_by, $sort_type)
            ->paginate($request->query('size') ? $request->query('size') : 30, ['*'], 'pageIndex', $request->has('pageIndex') ? ($request->pageIndex + 1) : 1)->toArray();
        return response()->json($posts);
    }

    public function store(PostRequest $request, Post $post)
    {
        $post->fill($request->all());
        $post->user_id = Auth::id();

        $save = $post->save();
        if (!$save) {
            throw new HttpException(500);
        }

        return response()->json([
            'status' => 'ok',
            'data' => ['success' => true, 'message' => 'post has been create']
        ], 201);
    }

    public function update(PostRequest $request)
    {
        $selected_post = Post::find($request->post_id);
        if (!$selected_post ) {
            return response()->json(["error" => ["message" => "Post not exsit"]]);
        }
        $this->authorize('update', $selected_post);
        $save = $selected_post->update($request->all());
        if (!$save) {
            throw new HttpException(500);
        }
        return response()->json([
            'status' => 'ok',
            'data' => ['success' => true, 'message' => 'post has been updated']
        ]);
    }

    public function destroy(Request $request)
    {
       
        
        $selected_post = Post::find($request->post_id);

        $this->authorize('destroy', $selected_post);
        if (!$selected_post) {
            return response()->json(["error" => ["message" => "Post not exsit"]]);
        }
        $save = $selected_post->delete();
        if (!$save) {
            throw new HttpException(500);
        } 
        return response()->json([
            'status' => 'ok',
            'data' => ['success' => true, 'message' => 'post has been deleted']
        ]);
    }
}

<?php

namespace App\Api\V1\Controllers;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\JWTAuth;
use App\Http\Controllers\Controller;
use App\Api\V1\Requests\LoginRequest;
use App\Api\V1\Requests\UpdatePasswordRequest;
use App\Api\V1\Requests\UpdateProfileRequest;
use Tymon\JWTAuth\Exceptions\JWTException;
use Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('jwt.auth', []);
    }

    /**
     * Get the authenticated User
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(Auth::guard()->user());
    }
    /**
     * Update User Profile.
     * @param  Request  $request
     * @return void
     */
    public function update(UpdateProfileRequest $request)
    {
        $user = Auth::guard()->user();

        DB::beginTransaction();

        try {

            $save = $user->update(['name' => $request['name']]);;

            if(!$save) {
                throw new HttpException(500);
            }

            $user->refresh();

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
            return $exception->getMessage();
        }

        return response()->json([
            'status' => 'ok',
            'data' => ['success' => true, 'message' => 'user profile has been updated', 'user' => $user]]);
    }

    /**
     * Change User Password.
     * @param  Request  $request
     * @return void
     */

    public function updatePassword(UpdatePasswordRequest $request, JWTAuth $JWTAuth)
    {

        $user = Auth::guard()->user();

        if (!(Hash::check($request->get('old_password'), $user->password))) {
            return response()->json(["error" => ["message" => "Your current password does not match with what your provided"]]);
        }
        if (strcmp($request->get('old_password'), $request->get('password')) == 0) {
            return response()->json(["error" => ["message" => "Your new password can not be same with your current password"]]);
        }

        $user->password = $request->get('password');
        $save = $user->save();

        if(!$save) {
            throw new HttpException(500);
        }
        
        return response()->json([
            'status' => 'ok',
            'data' => ['success' => true, 'message' => 'password has been updated', 'user' => $user]]);
    }
}

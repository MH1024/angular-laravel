<?php

use Dingo\Api\Routing\Router;

/** @var Router $api */
$api = app(Router::class);

$api->version('v1', function (Router $api) {
    $api->group(['prefix' => 'auth'], function(Router $api) {
        $api->post('signup', 'App\\Api\\V1\\Controllers\\SignUpController@signUp');
        $api->post('login', 'App\\Api\\V1\\Controllers\\LoginController@login');

        $api->post('recovery', 'App\\Api\\V1\\Controllers\\ForgotPasswordController@sendResetEmail');
        $api->post('reset', 'App\\Api\\V1\\Controllers\\ResetPasswordController@resetPassword');

        $api->post('logout', 'App\\Api\\V1\\Controllers\\LogoutController@logout');
        $api->post('refresh', 'App\\Api\\V1\\Controllers\\RefreshController@refresh');
        $api->get('me', 'App\\Api\\V1\\Controllers\\UserController@me');
    
        $api->post('update-password', 'App\\Api\\V1\\Controllers\\UserController@updatePassword');
        $api->put('update-profile', 'App\\Api\\V1\\Controllers\\UserController@update');
        // get user role
        $api->get('user/permissions', 'App\\Api\\V1\\Controllers\\PermissionsController@index');
        // admin manager user
        $api->get('users-list', 'App\\Api\\V1\\Controllers\\AdminController@index');
        $api->post('create-user', 'App\\Api\\V1\\Controllers\\AdminController@create');
        $api->post('update-user', 'App\\Api\\V1\\Controllers\\AdminController@update');
        $api->delete('delete-user', 'App\\Api\\V1\\Controllers\\AdminController@destroy');
        // manager post content
        $api->get('post-list', 'App\\Api\\V1\\Controllers\\PostController@index');
        $api->get('my-post-list', 'App\\Api\\V1\\Controllers\\PostController@show');
        $api->post('create-post', 'App\\Api\\V1\\Controllers\\PostController@store');
        $api->post('update-post', 'App\\Api\\V1\\Controllers\\PostController@update');
        $api->delete('delete-post', 'App\\Api\\V1\\Controllers\\PostController@destroy');
    });

    $api->group(['middleware' => 'jwt.auth'], function(Router $api) {
        $api->get('protected', function() {
            return response()->json([
                'message' => 'Access to protected resources granted! You are seeing this text as you provided the token correctly.'
            ]);
        });

        $api->get('refresh', [
            'middleware' => 'jwt.refresh',
            function() {
                return response()->json([
                    'message' => 'By accessing this endpoint, you can refresh your access token at each request. Check out this response headers!'
                ]);
            }
        ]);
    });

    $api->get('hello', function() {
        return response()->json([
            'message' => 'This is a simple example of item returned by your APIs. Everyone can see it.'
        ]);
    });
});

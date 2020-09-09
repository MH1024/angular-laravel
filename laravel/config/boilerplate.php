<?php

return [

    // these options are related to the sign-up procedure
    'sign_up' => [

        // this option must be set to true if you want to release a token
        // when your user successfully terminates the sign-in procedure
        'release_token' => env('SIGN_UP_RELEASE_TOKEN', true),

        // here you can specify some validation rules for your sign-in request
        'validation_rules' => [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' =>  array(
                'required',
                'regex:/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/'
            )
        
        ]
    ],

    // these options are related to the login procedure
    'login' => [

        // here you can specify some validation rules for your login request
        'validation_rules' => [
            'email' => 'required|email',
            'password' => 'required'
        ]
    ],

    // these options are related to the password recovery procedure
    'forgot_password' => [

        // here you can specify some validation rules for your password recovery procedure
        'validation_rules' => [
            'email' => 'required|email'
        ]
    ],

    // these options are related to the password recovery procedure
    'reset_password' => [

        // this option must be set to true if you want to release a token
        // when your user successfully terminates the password reset procedure
        'release_token' => env('PASSWORD_RESET_RELEASE_TOKEN', false),

        // here you can specify some validation rules for your password recovery procedure
        'validation_rules' => [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed'
        ]
    ],

     // these options are related to the update procedure
     'update_password' => [

        // here you can specify some validation rules for your sign-in request
        'validation_rules' => [
            'old_password' => 'required',
            'password' =>  array(
                'required',
                'regex:/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/'
            ),
            'password_confirmation' => 'required|same:password'
        
        ]
    ],
     // these options are related to the update procedure
     'update_user' => [

        // here you can specify some validation rules for your sign-in request
        'validation_rules' => [
            'user_id' => 'required',
            'name' => 'required|string|between:2,100',
            'password' =>  array(
                'filled', // only change password when has this key.
                'regex:/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$/'
            )
        ]
    ],

    // these options are related to the update procedure
    'update_profile' => [

        // here you can specify some validation rules for your sign-in request
        'validation_rules' => [
            'name' => 'required|string|between:2,100'
        ]
    ]

];

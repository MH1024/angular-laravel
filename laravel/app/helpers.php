<?php

function get_db_config() 
{
    if (getenv('IS_IN_HEROKU')) {
        $url = parse_url(getenv("DATABSE_URL"));

        return $db_config = [
            'connetion' => 'pgsql',
            'host' => $url["host"],
            'database' => substr($url['path'], 1),
            'username' => $url["user"],
            'password' => $url["pass"],
        ];
    } else {
        return $db_config = [
            'connection' => env('DB_CONNECTION', 'mysql'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'database'  => env('DB_DATABASE', 'Laravel'),
            'username'  => env('DB_USERNAME', 'root'),
            'password'  => env('DB_PASSWORD', ''),
        ];
    }
}
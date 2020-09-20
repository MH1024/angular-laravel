<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Post;
use Faker\Generator as Faker;

$factory->define(App\Models\Post::class, function (Faker $faker) {

    $sentence = $faker->sentence();

    // randam pick a date time in a month
    $updated_at = $faker->dateTimeThisMonth();

    // create time is set earlier than updated time.
    $created_at = $faker->dateTimeThisMonth($updated_at);

    return [
        'title' => $sentence,
        'body' => $faker->text(),
        'excerpt' => $sentence,
        'created_at' => $created_at,
        'updated_at' => $updated_at,
    ];
});
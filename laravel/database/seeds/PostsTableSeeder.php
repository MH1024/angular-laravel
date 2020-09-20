<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // All user ids
        $user_ids = User::all()->pluck('id')->toArray();


        // add 30 fake post to posts table
        $faker = app(Faker\Generator::class);

        $posts = factory(Post::class)
                        ->times(30)
                        ->make()
                        ->each(function ($post, $index)
                            use ($user_ids, $faker)
        {
            // randam pick user id and add to a post
            $post->user_id = $faker->randomElement($user_ids);

        });

        // insert fack array into posts table.
        Post::insert($posts->toArray());
    }
}

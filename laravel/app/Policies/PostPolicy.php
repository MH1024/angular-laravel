<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;


class PostPolicy extends Policy
{


     /**
     * User can view all post with manage content permission.
     *
     * @return void
     */
    public function show(User $user, Post $post)
    {
        return $user->can('manage_contents');
    }

    /**
     * User can only update their own post.
     *
     * @return void
     */
    public function update(User $user, Post $post)
    {
        return $user->isAuthorOf($post);
    }

    /**
     * User can only delete own post.
     *
     * @return void
     */
    public function destroy(User $user, Post $post)
    {
        return $user->isAuthorOf($post);
    }
}

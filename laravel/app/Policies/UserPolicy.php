<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function update(User $currentUser, User $user)
    {
        return $currentUser->id === $user->id;
    }
    /**
     * admin and founder can mangager user.
     *
     * @return void
     */
    public function index(User $currentUser) 
    {
        return $currentUser->can('manage_users'); 
    }
}

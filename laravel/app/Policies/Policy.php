<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class Policy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function before($user, $ability)
    {
        // if user has auth to manage content return true;
        if ($user->can('manage_contents')) {
            return true;
        }
    }
}

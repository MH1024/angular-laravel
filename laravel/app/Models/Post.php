<?php

namespace App\Models;

use Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;


class Post extends Model
{
    use Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable = [
        'title', 'body', 'excerpt'
    ];
    /**
     * the creater of the booking.
     *
     * @param  string  $value
     * @return user 
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}

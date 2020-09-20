<?php

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->delete();
        DB::table('users')->insert([
            'name' => 'Founder',
            'email' => 'founder@test.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password1'),
        ]);
        DB::table('users')->insert([
            'name' => 'Maintainer',
            'email' => 'maintainer@test.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password2'),
        ]);
        factory(App\Models\User::class, 18)->create();
        $f_user = User::where(['email' => 'founder@test.com'])->get()->first();
        $m_user = User::where(['email' => 'maintainer@test.com'])->get()->first();
        // set founder
        $f_user->assignRole('Founder');

        // set maintainer
        $m_user->assignRole('Maintainer');
        
    }
}

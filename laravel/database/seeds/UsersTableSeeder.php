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
        // DB::table('users')->insert([
        //     'name' => 'admin',
        //     'email' => 'test@test.com',
        //     'email_verified_at' => now(),
        //     'password' => Hash::make('password'),
        // ]);
        factory(App\Models\User::class, 20)->create();
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Contact;
use App\Models\Category;
use App\Models\Organization;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            PermissionSeeder::class
        ]);
        
        $account = Account::create(['name' => 'Jhiret Cell 1']);

        User::factory()->create([
            'account_id' => $account->id,
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'email' => 'admin@admin.com',
            'owner' => true,
        ])->givePermissionTo('Universales');

        Category::factory()->create([
            'name' => 'Pantallas',
        ]);
        Category::factory()->create([
            'name' => 'Celulares',
        ]);
        Category::factory()->create([
            'name' => 'Accesorios',
        ]);

        User::factory()->count(1)->create([
            'account_id' => $account->id
        ]);

        $organizations = Organization::factory()->count(2)->create([
            'account_id' => $account->id
        ]);

        Contact::factory()->count(2)->create([
            'account_id' => $account->id
        ])
            ->each(function (Contact  $contact) use ($organizations) {
                $contact->update(['organization_id' => $organizations->random()->id]);
            });
    }
}

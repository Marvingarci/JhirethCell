<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            'Universales',
            'Caja',
            'Caja Rapida',
            'Servicios',
            'Inventario',
            'Compañias',
            'Usuarios',
            'Reporte',
            'Cierre Diario',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['guard_name' => 'auth', 'name' => $permission]);
        }
    }
}

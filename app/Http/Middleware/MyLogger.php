<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MyLogger
{
    public function handle($request, Closure $next)
    {
        // Enable query logging
        DB::connection()->enableQueryLog();
        
        return $next($request);
    }

    public function terminate($request, $response)
    {
        // Get all queries that were executed
        $queries = DB::getQueryLog();
        
        // Get the authenticated user ID
        $userId = Auth::check() ? Auth::id() : null;

        // Filter and log only product-related actions
        foreach ($queries as $query) {
            // Customize the condition to filter only relevant queries
            if (str_contains(strtolower($query['query']), 'products')) {
                DB::table('logs')->insert([
                    'user_id' => $userId,
                    'query' => json_encode($query),
                ]);
            }
        }
    }
}

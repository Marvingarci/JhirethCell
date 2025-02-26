<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistence extends Model
{
    use HasFactory;

    protected $table = 'asistence';

    protected $appends = ['vendedor_name', 'created_at_day', 'created_at_day_diff'];

    protected $fillable = [
        'id',
        'user_id',
        'created_at' 
    ];

    public function vendedor()
    {
        return $this->hasOne(User::class, 'id' , 'user_id');
    }

    // created_at saves how many times a day workers register in and out of the company
    // make a attribute to get the first and last register in a day of created_at timestamp

    public function getCreatedAtDayAttribute($value)
    {
        $date = date('Y-m-d', strtotime($this->created_at));
        $asistences = Asistence::where('user_id', $this->user_id)
            ->whereDate('created_at', $date)
            ->orderBy('created_at', 'asc')
            ->get();
        $first = $asistences->first();
        $last = $asistences->last();
        return [
            'first' => $first->created_at,
            'last' => $last->created_at
        ];
    }

    // using getCreatedAtDayAttribute calculate the time difference between the first and last register in a day
    public function getCreatedAtDayDiffAttribute()
    {
        $date = date('Y-m-d', strtotime($this->created_at));
        $asistences = Asistence::where('user_id', $this->user_id)
            ->whereDate('created_at', $date)
            ->orderBy('created_at', 'asc')
            ->get();
        $first = $asistences->first();
        $last = $asistences->last();
        $first = strtotime($first->created_at);
        $last = strtotime($last->created_at);
        $diff = $last - $first;
        return gmdate('H:i:s', $diff);
    }


    public function getVendedorNameAttribute()
    {
        return isset($this->vendedor) ? $this->vendedor->first_name . ' ' . $this->vendedor->last_name : 'Usuario Inactivo';
    }
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->whereHas('vendedor', function ($query) use ($search) {
                $query->where('first_name', 'like', '%'.$search.'%')
                    ->orWhere('last_name', 'like', '%'.$search.'%');
            });
        })->when($filters['week'] ?? null, function ($query, $week) {
            // Check if the week is in the format 'YYYY-Wnn'
            $date = explode('-W', $week); // Changed to explode by '-W'
            if (count($date) === 2) {
                $year = $date[0];
                $week = $date[1];
                
                // Calculate the first and last day of the week
                $from = date("Y-m-d", strtotime("{$year}-W{$week}-1")); // Monday
                $to = date("Y-m-d", strtotime("{$year}-W{$week}-7"));   // Sunday

                // Adjust to include the whole day
                $to = date("Y-m-d H:i:s", strtotime("{$to} 23:59:59"));

                // Apply the whereBetween filter with adjusted time
                $query->whereBetween('created_at', [$from, $to]);
            }
        });
    }
}

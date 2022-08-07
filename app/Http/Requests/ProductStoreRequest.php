<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required', 'max:50'],

            //'product_code' => ['required', 'max:50', 'unique:products'],

            // 'organization_id' => ['nullable', Rule::exists('organizations', 'id')->where(function ($query) {
            //     $query->where('account_id', Auth::user()->account_id);
            // })],
            'category_id' => ['required', 'max:50'],
            'color' => ['nullable', 'max:50'],
            'cost_price' => ['required','numeric'],
            'dbType' => [''],
            'sell_price' => ['required', 'numeric'],
            'whole_sell_price' => ['required', 'numeric'],
            
        ];
    }
}

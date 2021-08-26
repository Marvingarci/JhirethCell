<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class InventarioStoreRequest extends FormRequest
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
            'product_id' => ['required', 'max:50'],
            'codebar' => ['required', 'max:50', 'unique:inventarios,codebar'],
            'imei' => ['required', 'max:50', 'unique:inventarios,imei'],    
            'status' => ['required']    

        ];
    }
}

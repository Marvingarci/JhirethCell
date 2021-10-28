<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class VentaStoreRequest extends FormRequest
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
            'cliente' => ['required'],
            'contact_id' => [''],
            'vendedor_id' => ['required'],
            'tipoPago' => ['required'],
            'total' => ['required', 'numeric'],
            'ventas'=>['required']
        ];
    }
}

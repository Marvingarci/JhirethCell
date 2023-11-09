<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransferenciaRequest extends FormRequest
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
            'description' => [''],
            'items' => ['required'],
            'new_company' => ['required', 'numeric'],
            'old_company' => ['required', 'numeric'],
            'note' => [''],
            'product_id' => ['required'],
            'send_by' => ['required', 'numeric'],
            'received_by'=>['required', 'numeric'],
            
        ];
    }
}

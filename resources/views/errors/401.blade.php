@extends('errors::minimal')

@section('title', __('Sin autorización'))
@section('code', '401')
@section('message', __('No tiene permisos para acceder a esta sección.'))

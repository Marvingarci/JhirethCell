@extends('errors::minimal')

@section('title', __('Forbidden'))
@section('code', '403')
@section('message', __('No tiene permisos para acceder a esta sección.'))

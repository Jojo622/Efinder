@extends('layouts.app')
@section('content')
<div class="row">
    <div class="col-6">
        <div class="card">
            <div class="card-body">
                <form action="{{ url('client/properties') }}" method="post" enctype="multipart/form-data">
                    @csrf
                    @include('client.properties.form', ['property' => $property, 'unit' => $unit])
                    <div class="form-group d-flex justify-content-end">
                        <button class="btn btn-primary" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

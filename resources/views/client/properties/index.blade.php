@extends('layouts.app')
@section('content')
<div class="row">
    <div class="col-12">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        <div class="card">
            <div class="card-body">
                <table class="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Location</th>
                            <th>Geo</th>
                            <th>Bed</th>
                            <th>Bath</th>
                            <th>Floor Area</th>
                            <th>Rent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($properties as $property)
                            @php $unit = $property->units->first(); @endphp
                            <tr>
                                <td>{{ $property->id }}</td>
                                <td>{{ $property->address }}</td>
                                <td>{{ $property->geo['lat'] ?? '' }}, {{ $property->geo['lng'] ?? '' }}</td>
                                <td>{{ $unit->bed ?? '' }}</td>
                                <td>{{ $unit->bath ?? '' }}</td>
                                <td>{{ $unit->floor_area ?? '' }}</td>
                                <td>{{ $unit->rent ?? '' }}</td>
                                <td>
                                    <a href="{{ route('properties.edit', $property) }}" class="btn btn-sm btn-secondary">Edit</a>
                                    <form action="{{ route('properties.destroy', $property) }}" method="POST" class="d-inline">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                {{ $properties->links() }}
            </div>
        </div>
    </div>
</div>
@endsection

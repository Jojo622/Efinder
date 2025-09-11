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
                            <th class="text-center">#</th>
                            <th>Location</th>
                            <th>Geo</th>
                            <th class="text-center">Bed</th>
                            <th class="text-center">Bath</th>
                            <th class="text-center">Floor Area</th>
                            <th>Rent</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($properties as $property)
                            @php $unit = $property->units->first(); @endphp
                            <tr>
                                <td class="text-center">{{ $property->id }}</td>
                                <td>{{ $property->address }}</td>
                                <td>{{ $property->geo['lat'] ?? '' }}, {{ $property->geo['lng'] ?? '' }}</td>
                                <td class="text-center">{{ $unit->bed ?? '' }}</td>
                                <td class="text-center">{{ $unit->bath ?? '' }}</td>
                                <td class="text-center">{{ $unit->floor_area ? $unit->floor_area . 'sqft' : '' }}</td>
                                <td>{{ $unit->rent ?? '' }}</td>
                                <td class="text-center">
                                    <a href="{{ route('properties.edit', $property) }}" class="btn btn-sm btn-success">Edit</a>
                                    <form action="{{ route('properties.destroy', $property) }}" method="POST" class="d-inline">
                                        @csrf
                                        @method('DELETE')
                                        <button class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                        <tr>
                            <td colspan="8" class="text-center">No property available</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
                {{ $properties->links() }}
            </div>
        </div>
    </div>
</div>
@endsection

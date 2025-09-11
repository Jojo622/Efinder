@extends('layouts.app')
@section('content')
<div class="row">
    <div class="col-6">
        <div class="card">
            <div class="card-body">
                <form action="{{ route('users.update', $user) }}" method="post">
                    @csrf
                    @method('PUT')
                    <div class="form-group">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" name="name" id="name" class="form-control @error('name') is-invalid @enderror" value="{{ old('name', $user->name) }}" />
                        @error('name')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" name="email" id="email" class="form-control @error('email') is-invalid @enderror" value="{{ old('email', $user->email) }}" />
                        @error('email')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="mobile_number" class="form-label">Contact Number</label>
                        <input type="text" name="mobile_number" id="mobile_number" class="form-control @error('mobile_number') is-invalid @enderror" value="{{ old('mobile_number', $user->mobile_number) }}" />
                        @error('mobile_number')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="role" class="form-label">Role</label>
                        <select name="role" id="role" class="custom-select @error('role') is-invalid @enderror">
                            <option value="Admin" {{ old('role', $user->role) == 'Admin' ? 'selected' : '' }}>Admin</option>
                            <option value="Client" {{ old('role', $user->role) == 'Client' ? 'selected' : '' }}>Client</option>
                        </select>
                        @error('role')
                            <div class="text-danger">{{ $message }}</div>
                        @enderror
                    </div>
                    <div class="form-group d-flex justify-content-end">
                        <button class="btn btn-primary" type="submit">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

<div class="form-group">
    <label for="address" class="form-label">Address</label>
    <input type="text" name="address" class="form-control @error('address') is-invalid @enderror" id="address" value="{{ old('address', $property->address ?? '') }}" />
    @error('address')
        <div class="text-danger">{{ $message }}</div>
    @enderror
</div>
<div class="row">
    <div class="col-6">
        <div class="form-group">
            <label for="latitude" class="form-label">Latitude</label>
            <input type="text" name="latitude" class="form-control @error('latitude') is-invalid @enderror" id="latitude" value="{{ old('latitude', $property->geo['lat'] ?? '') }}" />
            @error('latitude')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
    </div>
    <div class="col-6">
        <div class="form-group">
            <label for="longitude" class="form-label">Longitude</label>
            <input type="text" name="longitude" class="form-control @error('longitude') is-invalid @enderror" id="longitude" value="{{ old('longitude', $property->geo['lng'] ?? '') }}" />
            @error('longitude')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
    </div>
</div>
<div class="row">
    <div class="col-4">
        <div class="form-group">
            <label for="bed" class="form-label">No. of Beds</label>
            <input type="number" name="bed" class="form-control @error('bed') is-invalid @enderror" id="bed" value="{{ old('bed', $unit->bed ?? '') }}" />
            @error('bed')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
    </div>
    <div class="col-4">
        <div class="form-group">
            <label for="bath" class="form-label">No. of Bathrooms</label>
            <input type="number" name="bath" class="form-control @error('bath') is-invalid @enderror" id="bath" value="{{ old('bath', $unit->bath ?? '') }}" />
            @error('bath')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
    </div>
    <div class="col-4">
        <div class="form-group">
            <label for="floor_area" class="form-label">Floor Area</label>
            <input type="number" name="floor_area" class="form-control @error('floor_area') is-invalid @enderror" id="floor_area" value="{{ old('floor_area', $unit->floor_area ?? '') }}" />
            @error('floor_area')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
    </div>
</div>
<div class="row">
    <div class="col-4">
        <div class="form-group">
            <label for="rent" class="form-label">Rent</label>
            <input type="text" name="rent" class="form-control @error('rent') is-invalid @enderror" id="rent" value="{{ old('rent', $unit->rent ?? '') }}" />
            @error('rent')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
    </div>
    <div class="col-4">
        <div class="form-group">
            <label for="deposits" class="form-label">Deposits</label>
            <input type="text" name="deposits" class="form-control @error('deposits') is-invalid @enderror" id="deposits" value="{{ old('deposits', $unit->deposits ?? '') }}" />
            @error('deposits')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
    </div>
    <div class="col-4">
        <div class="form-group">
            <label for="availability">Availability</label>
            <select name="availability" id="availability" class="custom-select @error('availability') is-invalid @enderror">
                <option value="1" {{ old('availability', $unit->availability ?? 1) == 1 ? 'selected' : '' }}>Yes</option>
                <option value="0" {{ old('availability', $unit->availability ?? 1) == 0 ? 'selected' : '' }}>No</option>
            </select>
            @error('availability')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
    </div>
</div>
<div class="form-group">
    <label for="policies" class="form-label">Policies</label>
    <textarea name="policies" id="policies" class="w-full form-control @error('policies') is-invalid @enderror" rows="5">{{ old('policies', $unit->policies ?? '') }}</textarea>
    @error('policies')
        <div class="text-danger">{{ $message }}</div>
    @enderror
</div>
<div class="form-group">
    <label for="images" class="form-label">Images</label>
    <input type="file" name="images[]" id="images" class="form-control @error('images.*') is-invalid @enderror" multiple>
    @error('images.*')
        <div class="text-danger">{{ $message }}</div>
    @enderror
</div>
<div class="form-group">
    <label for="document" class="form-label">Document</label>
    <input type="file" name="document" id="document" class="form-control @error('document') is-invalid @enderror">
    @error('document')
        <div class="text-danger">{{ $message }}</div>
    @enderror
</div>


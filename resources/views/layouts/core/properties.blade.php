<!-- Featured Properties start -->
@php
    use Illuminate\Support\Facades\Storage;
@endphp
<div class="featured-properties content-area-16 slide-box-2">
    <div class="container">
        <!-- Main title -->
        <div class="main-title-4 d-flex">
            <h2 data-title="Chice Properties">Featured Properties</h2>
        </div>
    </div>
    <div class="slide-container">
        @forelse($properties as $property)
            @php
                $unit   = $property->units->first();
                $image  = $property->galleries->first();
            @endphp
            <div class="wrapper">
                <div class="card">
                    <div class="cardImage">
                        <div class="property-box-4">
                            <div class="property-photo">
                                <img class="img-fluid w-100" style="height: 285px; object-fit: cover" src="{{ $image ? Storage::url($image->path) : 'https://via.placeholder.com/350x200?text=No+Image' }}" alt="properties">
                                @if($unit)
                                    <div class="tag">{{ $unit->availability ? 'For Rent' : 'Not Available' }}</div>
                                    <div class="plan-price"><sup>$</sup>{{ $unit->rent }}<span>/month</span></div>
                                @endif
                            </div>
                            <div class="detail">
                                <div class="heading">
                                    <h3>
                                        <a href="#">{{ $property->name }}</a>
                                    </h3>
                                    <div class="location" style="color: #333">
                                        <i class="fa fa-map-marker"></i>{{ $property->address }}
                                    </div>
                                </div>
                                @if($unit)
                                    <div class="properties-listing clearfix">
                                        <ul>
                                            <li><i class="flaticon-bed"></i> {{ $unit->bed }} Beds</li>
                                            <li><i class="flaticon-bathroom"></i> {{ $unit->bath }} Baths</li>
                                            <li><i class="flaticon-area"></i> {{ $unit->floor_area }} sqft</li>
                                        </ul>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <p class="text-center w-100">No properties found.</p>
        @endforelse
    </div>
</div>
<!-- Featured Properties end -->

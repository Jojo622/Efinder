<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Unit;
use App\Models\Gallery;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $properties = Property::with('units')
            ->where('client_id', Auth::id())
            ->paginate(10);

        return view('client.properties.index', compact('properties'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $property = new Property();
        $unit = new Unit();

        return view('client.properties.create', compact('property', 'unit'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'bed' => 'required|integer',
            'bath' => 'required|integer',
            'floor_area' => 'required|integer',
            'rent' => 'required|numeric',
            'deposits' => 'nullable|numeric',
            'availability' => 'required|boolean',
            'policies' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'document' => 'nullable|file|max:5120',
        ]);

        $property = Property::create([
            'client_id' => Auth::id(),
            'address' => $validated['address'],
            'geo' => [
                'lat' => $validated['latitude'],
                'lng' => $validated['longitude'],
            ],
            'amenities' => [],
        ]);

        Unit::create([
            'property_id' => $property->id,
            'bed' => $validated['bed'],
            'bath' => $validated['bath'],
            'floor_area' => $validated['floor_area'],
            'rent' => $validated['rent'],
            'deposits' => $validated['deposits'] ?? null,
            'policies' => $validated['policies'] ?? null,
            'availability' => $validated['availability'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('galleries', 'public');
                Gallery::create([
                    'property_id' => $property->id,
                    'name' => $image->getClientOriginalName(),
                    'path' => $path,
                ]);
            }
        }

        if ($request->hasFile('document')) {
            $doc = $request->file('document');
            $path = $doc->store('documents', 'public');
            Document::create([
                'property_id' => $property->id,
                'name' => $doc->getClientOriginalName(),
                'path' => $path,
            ]);
        }

        return redirect()->route('properties.index')
            ->with('success', 'Property created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        $unit = $property->units()->first() ?? new Unit();

        return view('client.properties.edit', compact('property', 'unit'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'bed' => 'required|integer',
            'bath' => 'required|integer',
            'floor_area' => 'required|integer',
            'rent' => 'required|numeric',
            'deposits' => 'nullable|numeric',
            'availability' => 'required|boolean',
            'policies' => 'nullable|string',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'document' => 'nullable|file|max:5120',
        ]);

        $property->update([
            'address' => $validated['address'],
            'geo' => [
                'lat' => $validated['latitude'],
                'lng' => $validated['longitude'],
            ],
        ]);

        $unit = $property->units()->first();
        if ($unit) {
            $unit->update([
                'bed' => $validated['bed'],
                'bath' => $validated['bath'],
                'floor_area' => $validated['floor_area'],
                'rent' => $validated['rent'],
                'deposits' => $validated['deposits'] ?? null,
                'policies' => $validated['policies'] ?? null,
                'availability' => $validated['availability'],
            ]);
        } else {
            Unit::create([
                'property_id' => $property->id,
                'bed' => $validated['bed'],
                'bath' => $validated['bath'],
                'floor_area' => $validated['floor_area'],
                'rent' => $validated['rent'],
                'deposits' => $validated['deposits'] ?? null,
                'policies' => $validated['policies'] ?? null,
                'availability' => $validated['availability'],
            ]);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('galleries', 'public');
                Gallery::create([
                    'property_id' => $property->id,
                    'name' => $image->getClientOriginalName(),
                    'path' => $path,
                ]);
            }
        }

        if ($request->hasFile('document')) {
            $doc = $request->file('document');
            $path = $doc->store('documents', 'public');
            Document::create([
                'property_id' => $property->id,
                'name' => $doc->getClientOriginalName(),
                'path' => $path,
            ]);
        }

        return redirect()->route('properties.index')
            ->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        $property->delete();

        return redirect()->route('properties.index')
            ->with('success', 'Property deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $properties = Property::with('units', 'galleries')->paginate(10);

        return view('properties.index', [
            'properties' => $properties,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $query = Property::with('units', 'galleries');

        if ($request->filled('bedrooms')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->where('bed', $request->bedrooms);
            });
        }

        if ($request->filled('bathroom')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->where('bath', $request->bathroom);
            });
        }

        if ($request->filled('min_price') && $request->filled('max_price')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->whereBetween('rent', [$request->min_price, $request->max_price]);
            });
        }

        if ($request->filled('min_area') && $request->filled('max_area')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->whereBetween('floor_area', [$request->min_area, $request->max_area]);
            });
        }

        $properties = $query->paginate(10)->appends($request->except('page'));

        return view('properties.index', [
            'properties' => $properties,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data['property'] = Property::latest()->paginate();
        return view('properties.show', $data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

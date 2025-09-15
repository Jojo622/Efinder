<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with(['units', 'galleries']);

        if ($request->filled('bedrooms')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->where('bed', $request->input('bedrooms'));
            });
        }

        if ($request->filled('bathrooms')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->where('bath', $request->input('bathrooms'));
            });
        }

        if ($request->filled('location')) {
            $query->where('address', 'like', '%' . $request->input('location') . '%');
        }

        if ($request->filled('min_price')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->where('rent', '>=', $request->input('min_price'));
            });
        }

        if ($request->filled('max_price')) {
            $query->whereHas('units', function ($q) use ($request) {
                $q->where('rent', '<=', $request->input('max_price'));
            });
        }

        if ($request->filled('any-status') && $request->input('any-status') !== 'Any Status') {
            $availability = $request->input('any-status') === 'For Rent';
            $query->whereHas('units', function ($q) use ($availability) {
                $q->where('availability', $availability);
            });
        }

        $properties = $query->latest()->get();

        return view('welcome', compact('properties'));
    }
}


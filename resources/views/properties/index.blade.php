<!DOCTYPE html>
<html lang="zxx">
<head>
    <title>Neer - Real Estate HTML Template</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">

    <!-- External CSS libraries -->
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/bootstrap.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/animate.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/bootstrap-submenu.css') }}">

    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/bootstrap-select.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/magnific-popup.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/leaflet.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/map.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/fonts/font-awesome/css/font-awesome.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/fonts/bootstrap-icons/bootstrap-icons.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/fonts/flaticon/font/flaticon.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/fonts/linearicons/style.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/jquery.mCustomScrollbar.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/dropzone.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/slick.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/normalize.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/boxes-component.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/boxes-core.css') }}">

    <!-- Custom stylesheet -->
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/style.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/initial.css') }}">
    <link rel="stylesheet" type="text/css" id="style_sheet" href="{{ url('assets/css/skins/green.css') }}">

    <!-- Favicon icon -->
    <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" >

    <!-- Google fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@100;300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet">

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <link rel="stylesheet" type="text/css" href="{{ url('assets/css/ie10-viewport-bug-workaround.css') }}">

    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="js/ie8-responsive-file-warning.js"></script><![endif]-->
    <script src="{{ url('assets/js/ie-emulation-modes-warning.js') }}"></script>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="js/html5shiv.min.js"></script>
    <script src="js/respond.min.js"></script>
    <![endif]-->
</head>
<body>
    <div class="page_loader"></div>

    @include('layouts.core.header')
    @include('layouts.core.sidebar')

    <!-- Sub banner start -->
    <div class="sub-banner">
        <div class="container">
            <div class="breadcrumb-area">
                <h1>Properties Listing</h1>
                <ul class="breadcrumbs">
                    <li><a href="index.html">Home</a></li>
                    <li class="active">Properties Listing</li>
                </ul>
            </div>
        </div>
    </div>
    <!-- Sub Banner end -->

    <div class="properties-section content-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-md-12">
                    <!-- Option bar start -->
                    <div class="option-bar">
                        <div class="row">
                            <div class="col-lg-6 col-8">
                                <div class="sorting-options2">
                                    <span class="sort">Sort by:</span>
                                    <select class="selectpicker search-fields" name="default-order">
                                        <option>Default Order</option>
                                        <option>Price High to Low</option>
                                        <option>Price: Low to High</option>
                                        <option>Newest Properties</option>
                                        <option>Oldest Properties</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-6 col-4">
                                <div class="sorting-options">
                                    <a href="properties-list-rightside.html" class="change-view-btn active-view-btn"><i class="fa fa-th-list"></i></a>
                                    <a href="properties-grid-rightside.html" class="change-view-btn"><i class="fa fa-th-large"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    @if($properties->count())
                        @foreach($properties as $property)
                        <div class="property-box-2">
                            <div class="row g-0">
                                <div class="col-lg-5 col-md-5">
                                    <div class="property-photo">
                                        <a href="#" class="property-img">
                                            <img src="{{ $property->galleries->first()->path ?? url('assets/img/properties/properties-list-1.jpg') }}" alt="properties" class="img-fluid">
                                            <div class="price-box"><span>${{ number_format(optional($property->units->first())->rent, 2) }}</span> Per month</div>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-lg-7 col-md-7">
                                    <div class="detail">
                                        <div class="hdg">
                                            <h3 class="title">
                                                <a href="#">{{ $property->name }}</a>
                                            </h3>
                                            <h5 class="location">
                                                <a href="#">
                                                    <i class="flaticon-pin"></i>{{ $property->address }}
                                                </a>
                                            </h5>
                                        </div>
                                        <ul class="facilities-list clearfix">
                                            <li><span>Area</span>{{ optional($property->units->first())->floor_area }} Sqft</li>
                                            <li><span>Beds</span>{{ optional($property->units->first())->bed }}</li>
                                            <li><span>Baths</span>{{ optional($property->units->first())->bath }}</li>
                                            <li><span>Rent</span>${{ number_format(optional($property->units->first())->rent, 2) }}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endforeach
                        <div class="pagination-box hidden-mb-45 text-center">
                            {{ $properties->links('vendor.pagination.custom') }}
                        </div>
                    @else
                        <p>No properties found.</p>
                    @endif
                    </div>
                </div>
                <div class="col-lg-4 col-md-12">
                    <div class="sidebar-right">
                        <!-- Advanced search start -->
                        <div class="widget advanced-search">
                            <h3 class="sidebar-title">Advanced Search</h3>
                            <div class="s-border"></div>
                            <div class="m-border"></div>
                            <form method="POST" action="{{ route('properties.store') }}">
                                @csrf
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="all-status">
                                        <option>All Status</option>
                                        <option>For Sale</option>
                                        <option>For Rent</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="all-type">
                                        <option>All Type</option>
                                        <option>Apartments</option>
                                        <option>Shop</option>
                                        <option>Restaurant</option>
                                        <option>Villa</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="commercial">
                                        <option>Commercial</option>
                                        <option>Residential</option>
                                        <option>Commercial</option>
                                        <option>Land</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="location">
                                        <option>location</option>
                                        <option>United States</option>
                                        <option>American Samoa</option>
                                        <option>Belgium</option>
                                        <option>Canada</option>
                                    </select>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <select class="selectpicker search-fields" name="bedrooms">
                                                <option value="">Bedrooms</option>
                                                <option value="1" @selected(($filters['bedrooms'] ?? '') == '1')>1</option>
                                                <option value="2" @selected(($filters['bedrooms'] ?? '') == '2')>2</option>
                                                <option value="3" @selected(($filters['bedrooms'] ?? '') == '3')>3</option>
                                                <option value="4" @selected(($filters['bedrooms'] ?? '') == '4')>4</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <select class="selectpicker search-fields" name="bathroom">
                                                <option value="">Bathroom</option>
                                                <option value="1" @selected(($filters['bathroom'] ?? '') == '1')>1</option>
                                                <option value="2" @selected(($filters['bathroom'] ?? '') == '2')>2</option>
                                                <option value="3" @selected(($filters['bathroom'] ?? '') == '3')>3</option>
                                                <option value="4" @selected(($filters['bathroom'] ?? '') == '4')>4</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <select class="selectpicker search-fields" name="balcony">
                                                <option>Balcony</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <select class="selectpicker search-fields" name="garage">
                                                <option>Garage</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="range-slider clearfix form-group">
                                    <label>Area</label>
                                    <div data-min="0" data-max="10000" data-min-name="min_area" data-max-name="max_area" data-unit="Sq ft" class="range-slider-ui ui-slider" aria-disabled="false"></div>
                                    <div class="clearfix"></div>
                                </div>
                                <div class="range-slider clearfix form-group mb-30">
                                    <label>Price</label>
                                    <div data-min="0" data-max="150000"  data-min-name="min_price" data-max-name="max_price" data-unit="USD" class="range-slider-ui ui-slider" aria-disabled="false"></div>
                                    <div class="clearfix"></div>
                                </div>

                                <div class="accordion accordion-flush other-features mb-30" id="accordionFlushExample">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="flush-headingOne">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                Other Features
                                            </button>
                                        </h2>
                                        <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body">
                                                <h3 class="sidebar-title">Features</h3>
                                                <div class="s-border"></div>
                                                <div class="m-border"></div>
                                                <div class="checkbox checkbox-theme checkbox-circle">
                                                    <input id="checkbox2" type="checkbox">
                                                    <label for="checkbox2">
                                                        Air Condition
                                                    </label>
                                                </div>
                                                <div class="checkbox checkbox-theme checkbox-circle">
                                                    <input id="checkbox3" type="checkbox">
                                                    <label for="checkbox3">
                                                        Places to seat
                                                    </label>
                                                </div>
                                                <div class="checkbox checkbox-theme checkbox-circle">
                                                    <input id="checkbox4" type="checkbox">
                                                    <label for="checkbox4">
                                                        Swimming Pool
                                                    </label>
                                                </div>
                                                <div class="checkbox checkbox-theme checkbox-circle">
                                                    <input id="checkbox1" type="checkbox">
                                                    <label for="checkbox1">
                                                        Free Parking
                                                    </label>
                                                </div>
                                                <div class="checkbox checkbox-theme checkbox-circle">
                                                    <input id="checkbox7" type="checkbox">
                                                    <label for="checkbox7">
                                                        Central Heating
                                                    </label>
                                                </div>
                                                <div class="checkbox checkbox-theme checkbox-circle">
                                                    <input id="checkbox5" type="checkbox">
                                                    <label for="checkbox5">
                                                        Laundry Room
                                                    </label>
                                                </div>
                                                <div class="checkbox checkbox-theme checkbox-circle">
                                                    <input id="checkbox6" type="checkbox">
                                                    <label for="checkbox6">
                                                        Window Covering
                                                    </label>
                                                </div>
                                                <div class="checkbox checkbox-theme checkbox-circle">
                                                    <input id="checkbox8" type="checkbox">
                                                    <label for="checkbox8">
                                                        Alarm
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group mb-0">
                                    <button class="search-button">Search</button>
                                </div>
                            </form>
                        </div>
                        <!-- Recent properties start -->
                        <div class="widget recent-properties">
                            <h3 class="sidebar-title">Recent Properties</h3>
                            <div class="s-border"></div>
                            <div class="m-border"></div>
                            <div class="d-flex mb-3 recent-posts-box">
                                <a class="pr-3" href="properties-details.html">
                                    <img src="img/properties/small-properties-1.jpg" alt="small-properties" class="flex-shrink-0 me-3">
                                </a>
                                <div class="detail align-self-center">
                                    <h5>
                                        <a href="properties-details.html">Modern Family Home</a>
                                    </h5>
                                    <div class="listing-post-meta">
                                        $345,000 | <a href="#"><i class="fa fa-calendar"></i> Oct 27, 2021 </a>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex mb-3 recent-posts-box">
                                <a class="pr-3" href="properties-details.html">
                                    <img src="img/properties/small-properties-2.jpg" alt="small-properties" class="flex-shrink-0 me-3">
                                </a>
                                <div class="detail align-self-center">
                                    <h5>
                                        <a href="properties-details.html">Beautiful Single Home</a>
                                    </h5>
                                    <div class="listing-post-meta">
                                        $415,000 | <a href="#"><i class="fa fa-calendar"></i> Feb 14, 2022 </a>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex recent-posts-box">
                                <a class="pr-3" href="properties-details.html">
                                    <img src="img/properties/small-properties-3.jpg" alt="small-properties" class="flex-shrink-0 me-3">
                                </a>
                                <div class="detail align-self-center">
                                    <h5>
                                        <a href="properties-details.html">Real Luxury Villa</a>
                                    </h5>
                                    <div class="listing-post-meta">
                                        $345,000 | <a href="#"><i class="fa fa-calendar"></i> Jan 12, 2022 </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Posts by category Start -->
                        <div class="posts-by-category widget">
                            <h3 class="sidebar-title">Category</h3>
                            <div class="s-border"></div>
                            <div class="m-border"></div>
                            <ul class="list-unstyled list-cat">
                                <li><a href="#">Single Family <span>(45)</span></a></li>
                                <li><a href="#">Apartment <span>(21)</span> </a></li>
                                <li><a href="#">Condo <span>(23)</span></a></li>
                                <li><a href="#">Multi Family <span>(19)</span></a></li>
                                <li><a href="#">Villa <span>(19)</span></a> </li>
                                <li><a href="#">Other <span>(22) </span></a></li>
                            </ul>
                        </div>
                        <!-- Our agent sidebar start -->
                        <div class="our-agent-sidebar">
                            <div class="p-20">
                                <h3 class="sidebar-title">Our Agent</h3>
                                <div class="s-border"></div>
                                <div class="m-border"></div>
                            </div>
                            <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                </div>
                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                        <div class="team-1">
                                            <div class="team-thumb">
                                                <a href="#">
                                                    <img src="https://storage.googleapis.com/theme-vessel-items/checking-sites/neer-html/HTML/main/img/avatar/avatar-6.jpg" alt="agent-2" class="img-fluid">
                                                </a>
                                                <div class="team-social flex-middle">
                                                    <div class="team-overlay"></div>
                                                    <div class="team-social-inner">
                                                        <a rel="nofollow" href="#" class="facebook">
                                                            <i class="fa fa-facebook" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="twitter">
                                                            <i class="fa fa-twitter" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="google">
                                                            <i class="fa fa-google" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="linkedin">
                                                            <i class="fa fa-linkedin" aria-hidden="true"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="team-info">
                                                <h4>
                                                    <a href="#">John Pitarshon</a>
                                                </h4>
                                                <p>Creative Director</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="carousel-item">
                                        <div class="team-1">
                                            <div class="team-thumb">
                                                <a href="#">
                                                    <img src="https://storage.googleapis.com/theme-vessel-items/checking-sites/neer-html/HTML/main/img/avatar/avatar-7.jpg" alt="agent-2" class="img-fluid">
                                                </a>
                                                <div class="team-social flex-middle">
                                                    <div class="team-overlay"></div>
                                                    <div class="team-social-inner">
                                                        <a rel="nofollow" href="#" class="facebook">
                                                            <i class="fa fa-facebook" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="twitter">
                                                            <i class="fa fa-twitter" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="google">
                                                            <i class="fa fa-google" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="linkedin">
                                                            <i class="fa fa-linkedin" aria-hidden="true"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="team-info">
                                                <h4>
                                                    <a href="#">Martin Smith</a>
                                                </h4>
                                                <p>Web Developer</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="carousel-item">
                                        <div class="team-1">
                                            <div class="team-thumb">
                                                <a href="#">
                                                    <img src="https://storage.googleapis.com/theme-vessel-items/checking-sites/neer-html/HTML/main/img/avatar/avatar-5.jpg" alt="agent-2" class="img-fluid">
                                                </a>
                                                <div class="team-social flex-middle">
                                                    <div class="team-overlay"></div>
                                                    <div class="team-social-inner">
                                                        <a rel="nofollow" href="#" class="facebook">
                                                            <i class="fa fa-facebook" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="twitter">
                                                            <i class="fa fa-twitter" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="google">
                                                            <i class="fa fa-google" aria-hidden="true"></i>
                                                        </a>
                                                        <a rel="nofollow" href="#" class="linkedin">
                                                            <i class="fa fa-linkedin" aria-hidden="true"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="team-info">
                                                <h4>
                                                    <a href="#">Karen Paran</a>
                                                </h4>
                                                <p>Support Manager</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer start -->
    <footer class="main-footer-3">
        <div class="lines">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </div>
        <div class="subscribe-newsletter">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 col-md-6">
                        <h3>Subscribe Newsletter</h3>
                    </div>
                    <div class="col-lg-6 col-md-6">
                        <div class="Subscribe-box">
                            <div class="newsletter-content-wrap">
                                <form class="newsletter-form d-flex" action="#">
                                    <input class="form-control" type="email" id="email" placeholder="Email Address...">
                                    <button class="btn btn-theme" type="submit"><i class="fa fa-paper-plane"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
        <div class="footer-inner">
            <div class="container">
                <div class="row">
                    <div class="col-xl-4 col-lg-3 col-md-6 col-sm-6">
                        <div class="footer-item clearfix">
                            <img src="{{ url('assets/img/logos/logo.png') }}" alt="logo" class="f-logo">
                            <div class="s-border"></div>
                            <div class="m-border"></div>
                            <div class="text">
                                <P class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in pulvinar neque. Nulla finibus lobortis pulvinar. Donec a consectetur nulla. Nulla posuere sapien vitae lectus suscipit, et pulvinar nisi tincidunt. Aliquam erat.</P>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                        <div class="footer-item clearfix">
                            <h4>
                                Contact Info
                            </h4>
                            <div class="s-border"></div>
                            <div class="m-border"></div>
                            <ul class="contact-info">
                                <li>
                                    <i class="flaticon-pin"></i>Address: 44 New Design Street,
                                </li>
                                <li>
                                    <i class="flaticon-mail"></i><a href="mailto:sales@hotelempire.com">info@themevessel.com</a>
                                </li>
                                <li>
                                    <i class="flaticon-phone"></i><a href="tel:+55-417-634-7071">+0477 85X6 552</a>
                                </li>
                                <li class="mb-0">
                                    <i class="flaticon-fax"></i>+0477 85X6 552
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
                        <div class="footer-item">
                            <h4>
                                Useful Links
                            </h4>
                            <div class="s-border"></div>
                            <div class="m-border"></div>
                            <ul class="links">
                                <li>
                                    <a href="#"><i class="fa fa-angle-right"></i>Home</a>
                                </li>
                                <li>
                                    <a href="about.html"><i class="fa fa-angle-right"></i>About Us</a>
                                </li>
                                <li>
                                    <a href="services.html"><i class="fa fa-angle-right"></i>Services</a>
                                </li>
                                <li>
                                    <a href="blog-classic-sidebar-right.html"><i class="fa fa-angle-right"></i>Blog</a>
                                </li>
                                <li>
                                    <a href="dashboard.html"><i class="fa fa-angle-right"></i>Dashboard</a>
                                </li>
                                <li>
                                    <a href="contact.html"><i class="fa fa-angle-right"></i>Contact Us</a>
                                </li>
                                <li>
                                    <a href="elements.html"><i class="fa fa-angle-right"></i>Elements</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                        <div class="footer-item fi-2 clearfix">
                            <div class="footer-gallery clearfix">
                                <h4>Our Gallery</h4>
                                <div class="s-border"></div>
                                <div class="m-border"></div>
                                <ul>
                                    <li>
                                        <img src="{{ url('assets/img/properties/small-properties-1.jpg') }}" alt="small-img">
                                    </li>
                                    <li>
                                        <img src="{{ url('assets/img/properties/small-properties-2.jpg') }}" alt="small-img">
                                    </li>
                                    <li>
                                        <img src="{{ url('assets/img/properties/small-properties-3.jpg') }}" alt="small-img">
                                    </li>
                                    <li>
                                        <img src="{{ url('assets/img/properties/small-properties-4.jpg') }}" alt="small-img">
                                    </li>
                                    <li>
                                        <img src="{{ url('assets/img/properties/small-properties-5.jpg') }}" alt="small-img">
                                    </li>
                                    <li>
                                        <img src="{{ url('assets/img/properties/small-properties-6.jpg') }}" alt="small-img">
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sub-footer">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 col-md-6">
                        <p class="copy">© 2022 <a href="#">Theme Vessel.</a> All Rights Reserved.</p>
                    </div>
                    <div class="col-lg-6 col-md-6">
                        <div class="social-media clearfix">
                            <div class="social-list">
                                <div class="icon facebook">
                                    <div class="tooltip">Facebook</div>
                                    <span><i class="fa fa-facebook"></i></span>
                                </div>
                                <div class="icon twitter">
                                    <div class="tooltip">Twitter</div>
                                    <span><i class="fa fa-twitter"></i></span>
                                </div>
                                <div class="icon instagram">
                                    <div class="tooltip">Instagram</div>
                                    <span><i class="fa fa-instagram"></i></span>
                                </div>
                                <div class="icon github">
                                    <div class="tooltip">Github</div>
                                    <span><i class="fa fa-github"></i></span>
                                </div>
                                <div class="icon youtube mr-0">
                                    <div class="tooltip">Youtube</div>
                                    <span><i class="fa fa-youtube"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- Footer end -->

    <!-- Full Page Search -->
    <div id="full-page-search">
        <button type="button" class="close">×</button>
        <form action="#">
            <input type="search" value="" placeholder="type keyword(s) here"/>
            <button type="submit" class="btn btn-sm button-theme">Search</button>
        </form>
    </div>

    <script src="{{ url('assets/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ url('assets/js/jquery.min.js') }}"></script>
    <script src="{{ url('assets/js/bootstrap-submenu.js') }}"></script>
    <script src="{{ url('assets/js/rangeslider.js') }}"></script>
    <script src="{{ url('assets/js/jquery.mb.YTPlayer.js') }}"></script>
    <script src="{{ url('assets/js/bootstrap-select.min.js') }}"></script>
    <script src="{{ url('assets/js/jquery.easing.1.3.js') }}"></script>
    <script src="{{ url('assets/js/jquery.scrollUp.js') }}"></script>
    <script src="{{ url('assets/js/jquery.mCustomScrollbar.concat.min.js') }}"></script>
    <script src="{{ url('assets/js/leaflet.js') }}"></script>
    <script src="{{ url('assets/js/leaflet-providers.js') }}"></script>
    <script src="{{ url('assets/js/leaflet.markercluster.js') }}"></script>
    <script src="{{ url('assets/js/dropzone.js') }}"></script>
    <script src="{{ url('assets/js/slick.min.js') }}"></script>
    <script src="{{ url('assets/js/jquery.filterizr.js') }}"></script>
    <script src="{{ url('assets/js/jquery.magnific-popup.min.js') }}"></script>
    <script src="{{ url('assets/js/jquery.countdown.js') }}"></script>
    <script src="{{ url('assets/js/modernizr.custom.js') }}"></script>
    <script src="{{ url('assets/js/boxes-component.js') }}"></script>
    <script src="{{ url('assets/js/boxes-core.js') }}"></script>
    <script src="{{ url('assets/js/maps.js') }}"></script>
    <script src="{{ url('assets/js/app.js') }}"></script>

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="{{ url('assets/js/ie10-viewport-bug-workaround.js') }}"></script>
    <!-- Custom javascript -->
    <script src="{{ url('assets/js/ie10-viewport-bug-workaround.js') }}"></script>
</body>
</html>

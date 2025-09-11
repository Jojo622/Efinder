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

<!-- Banner start -->
<div class="banner" id="banner">
    <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item item-bg active">
                <img class="d-block w-100 h-100" src="{{ url('assets/img/banner/img-1.jpg') }}" alt="banner">
                <div class="carousel-caption banner-slider-inner d-flex h-100 text-start">
                    <div class="carousel-content container align-self-center">
                        <div class="banner-info2">
                            <div class="text-l">
                                <h3 class="text-uppercase">Discover Modern Villa</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                </p>
                                <a href="#" class="btn-6">Get Started Now</a>
                                <a href="#" class="btn-5">Free Download</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="carousel-item item-bg">
                <img class="d-block w-100 h-100" src="{{ url('assets/img/banner/img-2.jpg') }}" alt="banner">
                <div class="carousel-caption banner-slider-inner d-flex h-100 text-start">
                    <div class="carousel-content container align-self-center">
                        <div class="t-left banner-info2">
                            <div class="text-l">
                                <h3 class="text-uppercase">Find Your Dreem Property</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                </p>
                                <a href="#" class="btn-6">Get Started Now</a>
                                <a href="#" class="btn-5">Free Download</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="carousel-item item-bg">
                <img class="d-block w-100 h-100" src="{{ url('assets/img/banner/img-3.jpg') }}" alt="banner">
                <div class="carousel-caption banner-slider-inner d-flex h-100 text-start">
                    <div class="carousel-content container align-self-center">
                        <div class="t-left banner-info2">
                            <div class="text-l">
                                <h3 class="text-uppercase">Find Your Amazing Home</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                </p>
                                <a href="#" class="btn-6">Get Started Now</a>
                                <a href="#" class="btn-5">Free Download</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    <!-- Search Section start -->
    <div class="search-section ss-2" id="search-style-2">
        <div class="container">
            <div class="search-section-area ssa2 active-pate">
                <div class="search-area-inner">
                    <div class="search-contents">
                        <form action="" method="POST">
                            @csrf
                            <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                                    <div class="form-group">
                                        <select class="selectpicker search-fields" name="any-status">
                                            <option>Any Status</option>
                                            <option>For Rent</option>
                                            <option>For Sale</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                                    <div class="form-group">
                                        <select class="selectpicker search-fields" name="all-type">
                                            <option>All Type</option>
                                            <option>Apartments</option>
                                            <option>Condominiums</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                                    <div class="form-group">
                                        <select class="selectpicker search-fields" name="bedrooms">
                                            <option>Bedrooms</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                                    <div class="form-group">
                                        <select class="selectpicker search-fields" name="bathrooms">
                                            <option>Bathrooms</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                                    <div class="form-group range-slider clearfix">
                                        <div data-min="0" data-max="150000" data-unit="USD" data-min-name="min_price" data-max-name="max_price" class="range-slider-ui ui-slider" aria-disabled="false"></div>
                                        <div class="clearfix"></div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 col-sm-6 col-6">
                                    <div class="form-group">
                                        <button class="search-button seach-black" type="submit">Search</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Banner end -->

<!-- Search section start -->
<div class="search-section ss-search-style clearfix" id="search-style">
    <div class="container">
        <div class="search-section-area ssa2 active-pate">
            <div class="search-area-inner">
                <div class="search-contents">
                    <form method="GET" id="filter-property" action="{{ route('welcome') }}">
                        <div class="row">
                            <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="any-status">
                                        <option>Any Status</option>
                                        <option>For Rent</option>
                                        <option>For Sale</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="all-type">
                                        <option>All Type</option>
                                        <option>Apartments</option>
                                        <option>Shop</option>
                                        <option>Restaurant</option>
                                        <option>Villa</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="bedrooms">
                                        <option>Bedrooms</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="bathrooms">
                                        <option>Bathrooms</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                                <div class="form-group">
                                    <select class="selectpicker search-fields" name="location">
                                        <option>location</option>
                                        <option>United States</option>
                                        <option>American Samoa</option>
                                        <option>Belgium</option>
                                        <option>Canada</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                                <div class="form-group range-slider clearfix">
                                    <div data-min="0" data-max="150000" data-unit="USD" data-min-name="min_price" data-max-name="max_price" class="range-slider-ui ui-slider" aria-disabled="false"></div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-sm-6 col-6">
                                <div class="form-group">
                                    <button class="search-button seach-black">Search</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Search section end -->

@include('layouts.core.properties')

<!-- Services start -->
<div class="services content-area-14 bg-grea-3">
    <div class="container">
        <!-- Main title -->
        <div class="main-title-4 d-flex">
            <h2 data-title="Our Expertise"> Why Choose Us</h2>
        </div>
        <div class="row">
            <div class="col-lg-4 col-md-12">
                <div class="service-info">
                    <div class="icon">
                        <i class="flaticon-user"></i>
                    </div>
                    <div class="text">
                        <h3><a href="services.html">Personalized Service Possible</a></h3>
                        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown. </p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-12">
                <div class="service-info">
                    <div class="icon">
                        <i class="flaticon-empire-state-building"></i>
                    </div>
                    <div class="text">
                        <h3><a href="services.html">Luxury Real Estate Experts</a></h3>
                        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown. </p>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-12">
                <div class="service-info">
                    <div class="icon">
                        <i class="flaticon-discount"></i>
                    </div>
                    <div class="text">
                        <h3><a href="services.html">Modern Building For Rent $ Sell</a></h3>
                        <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown. </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Services end -->

<!-- Counters 2 strat -->
<div class="counters-2">
    <div class="container">
        <div class="row g-0">
            <div class="col-lg-3 col-md-6 col-sm-6 border-r border-l">
                <div class="counter-box-2">
                    <i class="flaticon-sale"></i>
                    <h1 class="counter">967</h1>
                    <p>Listings For Sale</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6 border-r">
                <div class="counter-box-2">
                    <i class="flaticon-rent"></i>
                    <h1 class="counter">1276</h1>
                    <p>Listings For Rent</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6 border-r">
                <div class="counter-box-2">
                    <i class="flaticon-user"></i>
                    <h1 class="counter">396</h1>
                    <p>Agents</p>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6 border-r">
                <div class="counter-box-2">
                    <i class="flaticon-broker"></i>
                    <h1 class="counter">177</h1>
                    <p>Brokers</p>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Counters 2 end -->

<!-- Our team start -->
<div class="our-team comon-slick content-area-14">
    <div class="container">
        <!-- Main title -->
        <div class="main-title-4 d-flex">
            <h2 data-title="Our Professionals"> Meet Our Team</h2>
        </div>
        <div class="slick row comon-slick-inner" data-slick='{"slidesToShow": 2, "responsive":[{"breakpoint": 1024,"settings":{"slidesToShow": 2}}, {"breakpoint": 768,"settings":{"slidesToShow": 1}}]}'>
            <div class="item slide-box">
                <div class="row team-2 g-0">
                    <div class="col-xl-5 col-lg-6 col-md-12 col-sm-12">
                        <div class="photo">
                            <img src="https://storage.googleapis.com/theme-vessel-items/checking-sites/neer-html/HTML/main/img/avatar/avatar-9.jpg" alt="avatar-10" class="img-fluid">
                        </div>
                    </div>
                    <div class="col-xl-7 col-lg-6 col-md-12 col-sm-12 align-self-center">
                        <div class="detail">
                            <h4>
                                <a href="agent-detail.html">Karen Paran</a>
                            </h4>
                            <h5>Office Manager</h5>
                            <div class="contact">
                                <ul>
                                    <li>
                                        <i class="flaticon-pin"></i><a>44 New Design Street,</a>
                                    </li>
                                    <li>
                                        <i class="flaticon-mail"></i><a href="mailto:info@themevessel.com">info@themevessel.com</a>
                                    </li>
                                    <li>
                                        <i class="flaticon-phone"></i><a href="tel:+554XX-634-7071"> +55 4XX-634-7071</a>
                                    </li>
                                </ul>
                            </div>

                            <ul class="social-list clearfix">
                                <li><a href="#" class="facebook-bg"><i class="fa fa-facebook"></i></a></li>
                                <li><a href="#" class="twitter-bg"><i class="fa fa-twitter"></i></a></li>
                                <li><a href="#" class="google-bg"><i class="fa fa-google-plus"></i></a></li>
                                <li><a href="#" class="linkedin-bg"><i class="fa fa-linkedin"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item slide-box">
                <div class="row team-2 g-0">
                    <div class="col-xl-5 col-lg-6 col-md-12 col-sm-12">
                        <div class="photo">
                            <img src="https://storage.googleapis.com/theme-vessel-items/checking-sites/neer-html/HTML/main/img/avatar/avatar-10.jpg" alt="avatar-9" class="img-fluid">
                        </div>
                    </div>
                    <div class="col-xl-7 col-lg-6 col-md-12 col-sm-12 align-self-center">
                        <div class="detail">
                            <h4>
                                <a href="agent-detail.html">Eliane Pereira</a>
                            </h4>
                            <h5>Creative Director</h5>
                            <div class="contact">
                                <ul>
                                    <li>
                                        <i class="flaticon-pin"></i><a>44 New Design Street,</a>
                                    </li>
                                    <li>
                                        <i class="flaticon-mail"></i><a href="mailto:info@themevessel.com">info@themevessel.com</a>
                                    </li>
                                    <li>
                                        <i class="flaticon-phone"></i><a href="tel:+554XX-634-7071"> +55 4XX-634-7071</a>
                                    </li>
                                </ul>
                            </div>

                            <ul class="social-list clearfix">
                                <li><a href="#" class="facebook-bg"><i class="fa fa-facebook"></i></a></li>
                                <li><a href="#" class="twitter-bg"><i class="fa fa-twitter"></i></a></li>
                                <li><a href="#" class="google-bg"><i class="fa fa-google-plus"></i></a></li>
                                <li><a href="#" class="linkedin-bg"><i class="fa fa-linkedin"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item slide-box">
                <div class="row team-2 g-0">
                    <div class="col-xl-5 col-lg-6 col-md-12 col-sm-12">
                        <div class="photo">
                            <img src="https://storage.googleapis.com/theme-vessel-items/checking-sites/neer-html/HTML/main/img/avatar/avatar-10.jpg" alt="avatar-9" class="img-fluid">
                        </div>
                    </div>
                    <div class="col-xl-7 col-lg-6 col-md-12 col-sm-12 align-self-center">
                        <div class="detail">
                            <h4>
                                <a href="agent-detail.html">Eliane Pereira</a>
                            </h4>
                            <h5>Creative Director</h5>
                            <div class="contact">
                                <ul>
                                    <li>
                                        <i class="flaticon-pin"></i><a>44 New Design Street,</a>
                                    </li>
                                    <li>
                                        <i class="flaticon-mail"></i><a href="mailto:info@themevessel.com">info@themevessel.com</a>
                                    </li>
                                    <li>
                                        <i class="flaticon-phone"></i><a href="tel:+554XX-634-7071"> +55 4XX-634-7071</a>
                                    </li>
                                </ul>
                            </div>

                            <ul class="social-list clearfix">
                                <li><a href="#" class="facebook-bg"><i class="fa fa-facebook"></i></a></li>
                                <li><a href="#" class="twitter-bg"><i class="fa fa-twitter"></i></a></li>
                                <li><a href="#" class="google-bg"><i class="fa fa-google-plus"></i></a></li>
                                <li><a href="#" class="linkedin-bg"><i class="fa fa-linkedin"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Our team end -->

<!-- testimonial 3 start  -->
<div class="testimonial-3 bg-grea-3">
    <div class="container">
        <div class="row">
            <div class="col-lg-6">
                <div class="testimonial-inner">
                    <!-- Main title -->
                    <div class="main-title-4 d-flex">
                        <h2 data-title="Testimonials"> Customer Reviews</h2>
                    </div>

                    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <div class="testimonial-info">
                                    <p><i class="fa fa-quote-left"></i> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. <i class="fa fa-quote-right"></i></p>
                                    <img src="{{ url('assets/img/avatar/avatar-2.jpg') }}" alt="avator" class="img-fluid">
                                    <h5>
                                        <a href="#">Anne Brady</a>
                                    </h5>
                                    <h6>Restaurant Owner</h6>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="testimonial-info">
                                    <p><i class="fa fa-quote-left"></i> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. <i class="fa fa-quote-right"></i></p>
                                    <img src="{{ url('assets/img/avatar/avatar-3.jpg') }}" alt="avator" class="img-fluid">
                                    <h5>
                                        <a href="#">Carolyn Stone</a>
                                    </h5>
                                    <h6>Web Designer, Uk</h6>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="testimonial-info">
                                    <p><i class="fa fa-quote-left"></i> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. <i class="fa fa-quote-right"></i></p>
                                    <img src="{{ url('assets/img/avatar/avatar-4.jpg') }}" alt="avator" class="img-fluid">
                                    <h5>
                                        <a href="#">Maikel Alisa</a>
                                    </h5>
                                    <h6>Designer</h6>
                                </div>
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- testimonial 3 end -->

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
<!-- Main header start -->
<header class="main-header header-fixed sticky-header" id="main-header-3">
    <div class="container">
        <div class="header-inner">
            <nav class="navbar navbar-expand-lg navbar-light">
                <a class="navbar-brand logos d-flex w-33 mr-auto" href="index.html">
                    <img src="{{ url('assets/img/logos/black-logo.png') }}" alt="logo" class="logo-photo">
                </a>
                <button class="navbar-toggler" id="drawer" type="button">
                    <span class="fa fa-bars"></span>
                </button>
                <div class="navbar-collapse collapse w-100 justify-content-end" id="navbar">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="{{ url('properties') }}">
                                Properties
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ url('about-us') }}">
                                About Us
                            </a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink7" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                My Account
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <li><a class="dropdown-item" href="{{ url('auth/login') }}">Login</a></li>
                                <li><a class="dropdown-item" href="{{ url('auth/register') }}">Register</a></li>
                                <li><a class="dropdown-item" href="{{ url('auth/reset-password') }}">Forgot Password</a></li>
                                @if (auth()->check())
                                <li><a class="dropdown-item" href="{{ url('home') }}">Dashboard</a></li>
                                <li><a class="dropdown-item" href="{{ url('client/profile') }}">My Profile</a></li>
                                <li><a class="dropdown-item" href="{{ url('client/properties') }}?type=mine">My Properties</a></li>
                                @endif
                            </ul>
                        </li>
                        <li class="nav-item sp">
                            <a href="{{ url('client/properties/create') }}" class="nav-link link-color"><i class="fa fa-plus"></i> Submit Property</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</header>
<!-- Main header end -->
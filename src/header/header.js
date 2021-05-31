import './header.css';
function Header () {
    return (
    <body class="header">
        <div class= "before_header">

        </div>
      <header class="header_section">
        <div class="container-fluid">
        <nav>
	<input id="nav-toggle" type="checkbox"></input>
	<div class="logo"><a href="#home"><strong><h1>ISP</h1></strong></a></div>
	<ul class="links">
		<li><a href="#home">Home</a></li>
		<li><a href="#about">About</a></li>
		<li><a href="#requests">Requests</a></li>
		<li><a href="#suppliers">For Suppliers</a></li>
		<li><a href="#contact">Contact</a></li>
        <li class="sign"><li><a href="#login">Login</a></li> <li><a href="#sign_in">Sign In</a></li></li>
	</ul>
	<label for="nav-toggle" class="icon-burger">
		<div class="line"></div>
		<div class="line"></div>
		<div class="line"></div>
	</label>
    
    <div>
    </div>

    </nav>  
        </div>
      </header>
      </body>)
}

export default Header; 
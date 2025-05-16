import logo from './Compact_Disc.svg';

function Header() {
   return (
      <header className="App-header">
	<div>
	  <img src={logo} className="App-logo" alt="logo" />
	  <h1>Simon's Seaside CD Scene</h1>
	  <h2>Special Selections for Serene Sunsets!</h2>
	</div>
	<div>
	  <nav id="nav">
	    <ul id="menu">
	      <li><a class="App-link" href="/cds">View CDs</a></li>
	      <li><a class="App-link" href="/add">Add CDs</a></li>
	    </ul>
	  </nav>
	</div>
      </header>
   )
}

export default Header

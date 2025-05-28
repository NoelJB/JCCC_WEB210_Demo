import { Link } from 'react-router-dom'

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
						<li><Link className="App-link" to="/">Home</Link></li>
						<li><Link className="App-link" to="/cds">CDs</Link></li>
					</ul>
				</nav>
			</div>
		</header>
	)
}

export default Header

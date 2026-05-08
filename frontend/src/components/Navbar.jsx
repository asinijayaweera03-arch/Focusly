import{ Link } from 'react-router-dom'

const Navbar = () => {

    return(
        <header>
          <div className="container">
            <Link to ="/">
              <h1>Focusly</h1>
            </Link>
             <Link to="/dashboard">
             <button>Dashboard</button>
             </Link>
          </div>
        </header>
    )
}

export default Navbar
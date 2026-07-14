import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home Page</h1>

      <Link to="/login">Login</Link>

      <br />

      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}

export default Home;
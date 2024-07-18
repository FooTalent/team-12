import CardWelcome from "../../sections/Home/CardWelcome";
import Navbar from "../../components/Navbar";
import Profile from "../../sections/Home/Profile";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafdff]">
      <Navbar />
      <Profile />
      <CardWelcome />
    </div>
  );
};

export default Home;

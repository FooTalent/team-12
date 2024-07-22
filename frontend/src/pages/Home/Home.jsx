import CardWelcome from "../../sections/Home/CardWelcome";
import Profile from "../../sections/Home/Profile";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafdff]">
      <Profile />
      <CardWelcome />
    </div>
  );
};

export default Home;

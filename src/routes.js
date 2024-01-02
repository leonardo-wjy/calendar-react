import React from "react";

//Home
const Home = React.lazy(() =>
  import("./views/Home/index")
);

//Profile
const Profile = React.lazy(() =>
  import("./views/Profile/index")
);

const routes = [
  //Home
  {
    path: "/",
    name: "Home",
    component: Home,
    exact: true,
  },
  //Profile
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    exact: true,
  },
];

export default routes;

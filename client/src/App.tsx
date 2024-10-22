import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Outlet />
    </div>
  )
};

export default App;
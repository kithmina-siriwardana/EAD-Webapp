import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return <div className="App"></div>;
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <div className="d-flex">
//           {" "}
//           <Sidebar />
//           <div className="content flex-grow-1 ">
//             <Routes>
//               <Route path="/dashboard" element={<Dashboard />} />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

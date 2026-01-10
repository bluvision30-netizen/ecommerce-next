export default function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("admin");
  return isAdmin ? children : (window.location.href = "/admin/login");
}

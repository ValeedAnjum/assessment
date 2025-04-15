// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useState } from "react";

function UserRow({ user }: any) {
  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.role}</td>
    </tr>
  );
}

export default function UserManagement() {
  //   const [users, setUsers] = useState([]);
  //   const { user } = useAuth();

  //   useEffect(() => {
  //     const fetchUsers = async () => {
  //       const usersRef = collection(db, "users");
  //       const snapshot = await getDocs(usersRef);
  //       setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  //     };
  //     fetchUsers();
  //   }, [user]);

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Current Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))} */}
        </tbody>
      </table>
    </div>
  );
}

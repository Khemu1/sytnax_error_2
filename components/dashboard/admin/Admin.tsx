import { openEditDialog } from "@/store/slices/dialogSlice";
import { AdminDashboard } from "@/types";
import React from "react";
import { useDispatch } from "react-redux";

const Admin: React.FC<{ admin: AdminDashboard }> = ({ admin }) => {
  const dispatch = useDispatch();
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openEditDialog(admin));
  };
  return (
    <>
      <td className="px-6 py-4">{admin.id}</td>
      <td className="px-6 py-4">{admin.username}</td>
      <th scope="row" className="px-6 py-4 font-medium text-white ">
        {admin.email}
      </th>
      <td className="px-6 py-4">{new Date(admin.createdAt).toDateString()}</td>
      <td className="px-6 py-4">
        {admin.updatedAt ? new Date(admin.updatedAt).toDateString() : null}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          type="button"
          onClick={handleEditClick}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Edit
        </button>
      </td>
    </>
  );
};

export default Admin;

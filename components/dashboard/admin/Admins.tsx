import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Admin from "./Admin";
import { AdminDashboard } from "@/types";
import { useGetAdmins, useDeleteAdmins } from "@/hooks/admin"; // Import the delete hook
import { RootState } from "@/store/store";
import { setAdmins } from "@/store/slices/dashboardSlice";
import { openNewAdminDialog } from "@/store/slices/dialogSlice";
import SkeletonTable from "@/components/skeletons/SkeletonTable";
import Toast from "@/components/skeletons/Toast";
import DashboardDialog from "../DashboardDialog";

const Admins: React.FC = () => {
  const [allAdmins, setAllAdmins] = useState<AdminDashboard[]>([]);
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const {
    handleDeleteAdmins,
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useDeleteAdmins();
  // Hook for fetching admins
  const {
    loading: fetchLoading,
    error: fetchError,
    data,
    handleGetAdmins,
  } = useGetAdmins();

  const dispatch = useDispatch();
  const dashboardState = useSelector((state: RootState) => state.dashboard);
  const dialogState = useSelector((state: RootState) => state.dialog);

  // Fetch admins if none are in the dashboard state
  useEffect(() => {
    if (dashboardState.admins.length < 1) {
      handleGetAdmins();
    } else {
      setAllAdmins(dashboardState.admins);
    }
  }, [dashboardState.admins, handleGetAdmins]);

  useEffect(() => {
    if (data && data.length > 0) {
      setAllAdmins(data);
      dispatch(setAdmins(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      const updatedAdmins = allAdmins.filter(
        (admin) => !selectedAdmins.includes(admin.id)
      );
      setAllAdmins(updatedAdmins);
      dispatch(setAdmins(updatedAdmins));
      setSelectedAdmins([]);
    }
  }, [deleteSuccess]);

  const handleAdminClick = (id: number) => {
    setSelectedAdmins((prev) =>
      prev.includes(id)
        ? prev.filter((adminId) => adminId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete selected admins?"
    );
    if (!confirmation) return;

    try {
      await handleDeleteAdmins(selectedAdmins);
      setToast({
        message: `Admin${
          selectedAdmins.length > 1 ? "s" : ""
        } deleted successfully.`,
        type: "success",
      });
    } catch (error) {
      console.error(
        `Error deleting admin${selectedAdmins.length > 1 ? "s" : ""}`,
        error
      );
      setToast({
        message: `Failed to delete Admin${
          selectedAdmins.length > 1 ? "s" : ""
        }. Please try again.`,
        type: "error",
      });
    }
  };
  const closeToast = () => {
    setToast(null);
  };

  // Show loading skeleton while fetching
  if (fetchLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Admins Table</h1>
      <div className="flex justify-between items-center">
        <button
          className="text-white font-semibold bg-blue-600 mb-4 px-4 py-2 rounded-lg shadow-lg"
          onClick={() => dispatch(openNewAdminDialog())}
        >
          New Admin
        </button>
        <button
          className={`mx text-white w-[100px] px-4 py-2  ${
            selectedAdmins.length === 0 ? "bg-gray-950" : "bg-red-600"
          } font-semibold rounded-lg`}
          onClick={handleDelete}
          disabled={selectedAdmins.length === 0 || deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Updated At
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {allAdmins.length > 0 ? (
              allAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  onClick={() => handleAdminClick(admin.id)}
                  className={`cursor-pointer border-b dark:border-gray-700 ${
                    selectedAdmins.includes(admin.id)
                      ? "bg-blue-200 dark:bg-gray-900 text-white"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-600"
                  }`}
                >
                  <Admin key={admin.id} admin={admin} />
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 font-semibold text-xl"
                >
                  No admins available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
      {(deleteError || fetchError) && (
        <div className="text-red-500 mt-2">
          {deleteError
            ? "Failed to delete admins. Please try again."
            : "Failed to fetch admins. Please try again."}
        </div>
      )}
      {deleteSuccess && (
        <div className="text-green-500 mt-2">Admins deleted successfully.</div>
      )}
      {dialogState.isDialogOpen && <DashboardDialog />}
    </div>
  );
};

export default Admins;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdminDashboard } from "@/types";
import { useGetOwners } from "@/hooks/admin";
import { RootState } from "@/store/store";
import { setOwners } from "@/store/slices/dashboardSlice";
import Owner from "./Owner";
import SkeletonTable from "@/components/skeletons/SkeletonTable";

const Admins: React.FC = () => {
  const [allOwners, setallOwners] = useState<AdminDashboard[]>([]);
  const [selectedOwners, setselectedOwners] = useState<number[]>([]);
  const {
    loading: fetchLoading,
    error: fetchError,
    data,
    handleGetOwners,
  } = useGetOwners();
  const dispatch = useDispatch();
  const dashboardState = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    if (dashboardState.owners.length === 0) {
      handleGetOwners();
    } else {
      setallOwners(dashboardState.owners);
    }
  }, [dashboardState.owners, handleGetOwners]);

  useEffect(() => {
    if (data && data.length > 0) {
      setallOwners(data);
      dispatch(setOwners(data));
    }
  }, [data, dispatch]);

  const handleAdminClick = (id: number) => {
    setselectedOwners((prev) =>
      prev.includes(id)
        ? prev.filter((ownerId) => ownerId !== id)
        : [...prev, id]
    );
  };

  if (fetchLoading) {
    return <SkeletonTable />;
  }

  return (
    <div className="mt-[3.0rem]">
      <h1 className="mb-5 mt-0">Owners Table</h1>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Updated At
              </th>
            </tr>
          </thead>
          <tbody>
            {allOwners.length > 0 &&
              allOwners.map((owner) => (
                <tr
                  key={owner.id}
                  onClick={() => handleAdminClick(owner.id)}
                  className={`cursor-pointer border-b dark:border-gray-700 ${
                    selectedOwners.includes(owner.id)
                      ? "bg-blue-200 dark:bg-gray-900 text-white"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-600"
                  }`}
                >
                  <Owner owner={owner} />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {fetchError && (
        <div className="text-red-500 mt-2">
          {"Failed to fetch Owners. Please try again."}
        </div>
      )}
    </div>
  );
};

export default Admins;

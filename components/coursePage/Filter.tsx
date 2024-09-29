import { useEffect, useState } from "react";
import { filters } from "@/constants";
import { useSearchParams } from "next/navigation";

const Filter = () => {
  const [data, setData] = useState(filters[0]);
  const searchParams = useSearchParams();

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;
    const AllsearchParams = new URLSearchParams(window.location.search);

    if (value.toLowerCase() === data.value.toLowerCase()) {
      return;
    }

    const selectedFilter = filters.find((f) => f.value === value);
    setData(selectedFilter ?? filters[0]);

    AllsearchParams.set(
      "sortBy",
      (selectedFilter?.value ?? filters[0].value).toLowerCase()
    );

    const newUrl = `${window.location.pathname}?${AllsearchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  useEffect(() => {
    const sortBy = searchParams.get("sortBy");

    if (sortBy) {
      setData(
        filters.find((f) => f.value.toLowerCase() === sortBy) ?? filters[0]
      );
    } else {
      const AllsearchParams = new URLSearchParams(window.location.search);
      AllsearchParams.set("sortBy", filters[0].value.toLowerCase());

      const newUrl = `${
        window.location.pathname
      }?${AllsearchParams.toString()}`;
      window.history.pushState({}, "", newUrl);

      setData(filters[0]);
    }
  }, [searchParams]);

  return (
    <div className="dropdown rounded-none bg-transparent">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1 bg-base-100 rounded-md text-[11px] sm:text-[16px]"
      >
        Sort By: {data.name}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content text-center bg-base-200 menu rounded-box z-[1] w-52 p-2 shadow"
      >
        {filters.map((f) => (
          <button
            className={`py-1  ${
              f.value.toLowerCase() === data.value.toLowerCase()
                ? "bg-blue-500 text-white"
                : "bg-transparent hover:bg-base-300"
            }`}
            type="button"
            key={f.value}
            value={f.value}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleOnClick(e)
            }
          >
            {f.name}
          </button>
        ))}
      </ul>
    </div>
  );
};

export default Filter;

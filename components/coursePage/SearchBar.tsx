"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBar = () => {
  const [data, setData] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setData(q);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(window.location.search);

    if (data.trim()) {
      searchParams.set("q", data.trim());
    } else {
      searchParams.delete("q");
    }

    const newPathName = `${
      window.location.pathname
    }?${searchParams.toString()}`;
    window.history.pushState({}, "", newPathName);
  };

  return (
    <form
      className="flex flex-1"
      onSubmit={(e: React.FormEvent) => handleSubmit(e)}
    >
      <div className="join w-full">
        <div className="flex flex-1">
          <input
            className="w-full input input-bordered join-item"
            placeholder="Search"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
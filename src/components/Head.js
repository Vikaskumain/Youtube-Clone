import React, { useContext, useEffect, useState } from "react";
import { toggleMenu } from "./utils/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { YOUTUBE_SEARCH_API } from "./utils/constant";
import { addCache } from "./utils/searchSlice";
import VideoContainer from "./VideoContainer";
import SearchVideoContainer from "./SearchVideoContainer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { addResult } from "./utils/searchResultSlice";
import Query from "./utils/searchTextContext";

const Head = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestion, setShowSuggestion] = useState([]);
  const [hideSuggestion, setHideSuggestion] = useState(false);

  // const [showResult, setShowResult] = useState(false);
  // console.log(searchQuery)
  const searchCache = useSelector((store) => store.searchSlice);
  // console.log(searchCache.searchQuery)
  const dispatch = useDispatch();

  // console.log("ApiCall-");
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchCache[searchQuery]) {
        setShowSuggestion(searchCache[searchQuery]);
      } else {
        getSearchSuggestion();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const getSearchSuggestion = async () => {
    // console.log("ApiCall- " + searchQuery);
    const data = await fetch(YOUTUBE_SEARCH_API + searchQuery);
    const json = await data.json();
    // console.log(json);
    setShowSuggestion(json[1]);

    // console.log(json);

    //update cache
    dispatch(
      addCache({
        [searchQuery]: json[1],
      })
    );
  };

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search/${searchQuery}`);
      setSearchQuery("");
    }
  };
  // console.log(searchQuery)''

  // console.log(clickHandler);
  return (
    <div className="grid grid-flow-col p-7 m-3 shadow-lg ">
      <div className="flex col-span-1 h-9">
        <img
          onClick={() => toggleMenuHandler()}
          className="h-8 cursor-pointer "
          src="https://static.vecteezy.com/system/resources/previews/002/292/406/original/hamburger-menu-line-icon-free-vector.jpg"
          alt="hamburger"
        />
        <a href="/">
          <img
            className="h-9  ml-7  w-28   rounded-full"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/2560px-Logo_of_YouTube_%282015-2017%29.svg.png"
            alt="youtube logo"
            
          
          />
        </a>
      </div>

      <div className="col-span-10 px-10 ">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setHideSuggestion(true)}
          onBlur={() => setHideSuggestion(false)}
          type="text"
          placeholder="Search"
          className="w-1/2 border border-gray-400 rounded-l-full p-2 "
        />

        <button
        className=" rounded-r-full border-[1px] border-gray-400 px-4 py-2 hover:bg-gray-200 "
          onClick={(e) => {
            handleSearch(e);
          }}
        >
         🔍
        </button>

        {hideSuggestion && (
          <ul className="fixed w-[33rem] py-2 px-2 bg-white shadow-lg rounded-lg border border-gray-200">
            {showSuggestion.map((s) => (
              <li
                key={s}
                className="border-bottom p-1.5 shadow-sm hover:bg-slate-100 "
              >
                🔍 {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <img
          className="h-8 col-span-1"
          src="https://cdn-icons-png.flaticon.com/512/709/709722.png"
          alt="user-icon"
        />
      </div>
    </div>
  );
};

export default Head;

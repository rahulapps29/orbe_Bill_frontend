// import { useEffect, useRef, useState } from "react";
// import "./SearchableDropdown.css";
// const SearchableDropdown = ({
//   options,
//   label,
//   id,
//   selectedVal,
//   handleChange
// }) => {
//   const [query, setQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const inputRef = useRef(null);

//   useEffect(() => {
//     document.addEventListener("click", toggle);
//     return () => document.removeEventListener("click", toggle);
//   }, []);

//   const selectOption = (option) => {
//     setQuery(() => "");
//     handleChange(option);
//     setSelectedItem(option);
//     setIsOpen((isOpen) => !isOpen);
//   };

//   function toggle(e) {
//     setIsOpen(e && e.target === inputRef.current);
//   }

//   const getDisplayValue = () => {
//     if(selectedItem) return selectedItem[label];
//     if (query) return query;
//     if (selectedVal) return selectedVal;

//     return "";
//   };

//   const filter = (options) => {
//     return options.filter(
//       (option) => option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
//     );
//   };

//   return (
//     <div className="dropdown">
//       <div className="control">
//         <div className="selected-value">
//           <input
//             ref={inputRef}
//             type="text"
//             value={getDisplayValue()}
//             name="searchTerm"
//             onChange={(e) => {
//               setQuery(e.target.value);
//               handleChange(null);
//             }}
//             onClick={toggle}
//           />
//         </div>
//         <div className={`arrow ${isOpen ? "open" : ""}`}></div>
//       </div>

//       <div className={`options ${isOpen ? "open" : ""}`}>
//         {filter(options).map((option, index) => {
//           return (
//             <div
//               onClick={() => selectOption(option)}
//               className={`option ${
//                 option[label] === selectedVal ? "selected" : ""
//               }`}
//               key={`${id}-${index}`}
//             >
//               {option[label]}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default SearchableDropdown;


import React, { useEffect, useRef, useState } from "react";
import "./SearchableDropdown.css";

const SearchableDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
  props
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setSelectedItem(props.itemList[id]);
  }, [props])
  const inputRef = useRef(null);
  // console.log("data",props.itemList);
  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery("");
    handleChange(option);
    setSelectedItem(option);
    setIsOpen(false);
  };

  const toggle = (e) => {
    if (inputRef.current && inputRef.current.contains(e.target)) {
      setIsOpen(true);
      // console.log(options);
    } else {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedItem(null); // Clear selected item when input changes
  };

  const getDisplayValue = () => {
    if (selectedItem) return selectedItem[label];
    if (query) return query;
    if (selectedVal) return selectedVal;
    // console.log("query",query);

    return "";
  };

  const filter = (options) => {
    return options.filter(
      (option) =>
        option[label].toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  return (
    <div className="dropdown">
      <div className="control" ref={inputRef}>
        <input
          type="text"
          autocomplete="one-time-code"
          value={getDisplayValue()}
          onChange={handleInputChange}
          placeholder="Search..."
          onClick={() => setIsOpen(true)}
        />
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      {isOpen && (
        <div className="options">
          {filter(options).map((option, index) => (
            <div
              onClick={() => selectOption(option)}
              className={`option ${
                option[label] === selectedVal ? "selected" : ""
              }`}
              key={index}
            >
              {option[label]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;




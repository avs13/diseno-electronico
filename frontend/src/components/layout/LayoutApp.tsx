import { useState } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const items: Item[] = [
  {
    to: "/real-time",
    label: "Ubicacion Actual",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 mr-1 inline-block"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
        />
      </svg>
    ),
  },
  {
    to: "/history",
    label: "Historia",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 mr-1 inline-block"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

interface Item {
  to: string;
  label: string;
  icon?: JSX.Element | string;
  children?: {
    to: string;
    label: string;
    icon?: JSX.Element | string;
  }[];
}

interface INav {
  items: Item[];
}

function Nav({ items }: INav) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <nav
      className={`bg-gray-900 h-full transition  text-white text-sm ${
        isOpen ? "w-[200px]" : "w-[60px]"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-6 h-6 ml-5 mb-4 transition cursor-pointer ${
          isOpen ? "" : "rotate-90"
        }`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>

      <ul>
        {items.map((item) => (
          <NavLink to={item.to} key={item.to}>
            {({ isActive }) => (
              <li
                className={` text-white hover:text-gray-100 transition py-3 pl-5 active:bg-blue-500 active:rounded-lgrounded-lg ${
                  isActive ? "bg-gray-800" : ""
                }`}
              >
                {item.icon && item.icon}
                {isOpen && item.label}
              </li>
            )}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}

export default function LayoutApp({ children }: Props): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="w-screen h-12 bg-gray-900"></div>
      <div className="flex flex-auto flex-row flex-wrap items-stretch">
        <div>
          <Nav items={items} />
        </div>

        <div className="flex flex-auto flex-col w-0 px-6 box-border bg-slate-100">
          <main className="bg-slate-50 lg:p-6 pt-6 px-4 lg:rounded-md flex-auto mt-10">
            {children}
          </main>
          <footer className="text-center my-4 font-semibold"></footer>
        </div>
      </div>
    </div>
  );
}

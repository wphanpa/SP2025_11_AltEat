import Filter from "./Filter";

interface FilterTag {
  title: string;
  items: string[];
}

interface SearchSideBarProps {
  filter: FilterTag[];
}

function SearchSideBar({ filter }: SearchSideBarProps) {
  return (
    <>
      {/* Side Bar */}
      <aside className="w-82 bg-[#F5F5F5] h-screen sticky shadow-[4px_0_4px_rgba(0,0,0,0.25)]">
        <div>
          {/* Filter Tag */}
          {filter.map((tag) => (
            <Filter title={tag.title} items={tag.items} />
          ))}
        </div>
      </aside>
    </>
  );
}

export default SearchSideBar;

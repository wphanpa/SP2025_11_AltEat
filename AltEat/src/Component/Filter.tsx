interface FilterProps {
  title: string;
  items: string[];
}

function Filter({ title, items }: FilterProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-[85%]">
          <div className="mb-8">
            {/* Title */}
            <h3 className="mt-5 text-2xl">{title}</h3>
            <hr className="mt-2 border-t-2 border-[#CDCDCD]" />
            {/* Filter Item */}
            <div className="mt-5 grid grid-cols-3 gap-x-3.5 gap-y-5">
              {items.map((item) => (
                <p
                  key={item}
                  className="p-2 bg-white rounded-3xl text-center text-[14px] shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Filter;

import dayjs from "dayjs";
import { MagnifyinGlass } from "../../components/icons";

interface RangeDate {
  startDate: string;
  endDate: string;
}
interface Props {
  rangeDate: RangeDate;
  setRangeDate: (value: RangeDate) => void;
  onSearchHistory: () => void;
}

export const Search = ({ rangeDate, setRangeDate, onSearchHistory }: Props) => {
  return (
    <>
      <h1 className="font-semibold text-xl text-center">Históricos de ubicaciones</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex justify-between w-8/12">
          <div>
            <div>
              <span className="font-semibold">Fecha inicio: </span>
              <input
                type="datetime-local"
                max={rangeDate.endDate}
                value={rangeDate.startDate}
                onChange={({ target }) => {
                  setRangeDate({
                    ...rangeDate,
                    startDate: target.value,
                  });
                }}
              />
            </div>
            <div>
              <span className="font-semibold">Fecha final: </span>
              <input
                type="datetime-local"
                value={rangeDate.endDate}
                min={rangeDate.startDate ?? ""}
                max={dayjs().endOf("day").format("YYYY-MM-DDTHH:mm")}
                onChange={({ target }) =>
                  setRangeDate({
                    ...rangeDate,
                    endDate: target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-900 active:bg-gray-700 transition p-1 rounded-md text-white flex px-2 py-1 items-center"
          onClick={onSearchHistory}
        >
          <MagnifyinGlass />
          Buscar
        </button>
        <p className="text-gray-600">
          Para selecionar área arrastre el mouse manteniendo presionado:
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
              d="M5,21 L19,21 L5,21 Z M16,12 L16,17 L8,17 L8,12 L3,12 L12,3 L21,12 L16,12 Z"
            />
          </svg>
          (shift) + Click izquierdo
        </p>
      </form>
    </>
  );
};

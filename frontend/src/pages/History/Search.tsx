import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ToggleButton } from "../../components/ToggleButton";
import { MagnifyinGlass } from "../../components/icons";
interface RangeDate {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}
interface Props {
  searchByArea: boolean;
  area: number;
  rangeDate: RangeDate;
  setRangeDate: (value: RangeDate) => void;
  onSearchHistory: () => void;
  setSearchByArea: (value: boolean) => void;
  setArea: (value: number) => void;
}
dayjs.extend(isoWeek);

export const Search = ({
  area,
  rangeDate,
  setRangeDate,
  searchByArea,
  setSearchByArea,
  setArea,
  onSearchHistory,
}: Props) => {
  return (
    <>
      <p className="font-semibold text-xl text-center">Mi ultima ubicacion</p>
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
                type="date"
                max={rangeDate.endDate}
                value={rangeDate.startDate}
                onChange={({ target }) =>
                  setRangeDate({
                    ...rangeDate,
                    startDate: target.value,
                  })
                }
              />
            </div>
            <div>
              <span className="font-semibold">Fecha final: </span>
              <input
                type="date"
                value={dayjs(rangeDate.endDate).format("YYYY-MM-DD")}
                min={rangeDate.startDate ?? ""}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={({ target }) =>
                  setRangeDate({
                    ...rangeDate,
                    endDate: target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <div>
              <span className="font-semibold">Hora inicio:</span>
              <input
                type="time"
                value={rangeDate.startTime}
                max={rangeDate.endTime}
                onChange={({ target }) =>
                  setRangeDate({
                    ...rangeDate,
                    startTime: target.value,
                  })
                }
              />
            </div>

            <div>
              <span className="font-semibold">Hora final:</span>
              <input
                type="time"
                value={rangeDate.endTime}
                onChange={({ target }) =>
                  setRangeDate({
                    ...rangeDate,
                    endTime: target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <div>
              <label htmlFor="">
                Buscar por area:
                <ToggleButton
                  onChange={({ target }) => {
                    setSearchByArea(target.checked);
                    setRangeDate({
                      ...rangeDate,
                      startDate: dayjs()
                        .startOf("isoWeek")
                        .format("YYYY-MM-DD"),
                    });
                  }}
                  value={searchByArea}
                />
              </label>
            </div>
            {searchByArea && (
              <label htmlFor="" className="w-full">
                Rango:
                <input
                  type="range"
                  min="200"
                  step="100"
                  max="2000"
                  value={area}
                  onChange={({ target }) => {
                    setArea(parseInt(target.value));
                  }}
                />
                <p> {area} m </p>
              </label>
            )}
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
      </form>
    </>
  );
};

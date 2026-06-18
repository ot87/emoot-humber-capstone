import lockIcon from "@/assets/icon-lock-sm.svg";

const ROW_COUNT = 3;
const TILES_PER_ROW = 3;

export function BingoLockedGrid() {
  return (
    <div className="grid w-full grid-cols-3 gap-3" aria-label="Locked bingo board preview">
      {Array.from({ length: ROW_COUNT * TILES_PER_ROW }, (_, index) => (
        <div
          key={index}
          className="flex aspect-square w-full items-center justify-center rounded-xl bg-bingo-locked-tile"
        >
          <img
            src={lockIcon}
            alt=""
            width={17}
            height={17}
            decoding="async"
            className="size-4"
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}

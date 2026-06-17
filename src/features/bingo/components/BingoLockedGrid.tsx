import lockIcon from "@/assets/icon-lock-sm.svg";

const LOCKED_TILE_COUNT = 9;

export function BingoLockedGrid() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Locked bingo board preview">
      {Array.from({ length: LOCKED_TILE_COUNT }, (_, index) => (
        <div
          key={index}
          className="flex aspect-square items-center justify-center rounded-xl bg-surface"
        >
          <img
            src={lockIcon}
            alt=""
            width={17}
            height={17}
            decoding="async"
            className="size-[17px]"
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}

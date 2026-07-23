export default function AtomColorKey() {
  return (
    <div className="flex">
      <div className="m-2 h-[calc(100%-8px)] overflow-hidden rounded-xl border border-border">
        <div className="h-1/5 w-5 bg-[#49E281] dark:bg-[#22c55e]"></div>
        <div className="h-1/5 w-5 bg-[#858585] dark:bg-[#374151]"></div>
        <div className="h-1/5 w-5 bg-[#FF974D] dark:bg-[#f97316]"></div>
        <div className="h-1/5 w-5 bg-[#007596] dark:bg-[#005f78]"></div>
        <div className="h-1/5 w-5 bg-[#D1D1D1] dark:bg-[#000000]"></div>
      </div>
      <div className="my-2 mx-1 h-[calc(100%-8px)]">
        <div className="flex h-1/5 items-center">Passivated</div>
        <div className="flex h-1/5 items-center">Substrate</div>
        <div className="flex h-1/5 items-center">Deposited</div>
        <div className="flex h-1/5 items-center">Free</div>
        <div className="flex h-1/5 items-center">Empty</div>
      </div>
    </div>
  )
}

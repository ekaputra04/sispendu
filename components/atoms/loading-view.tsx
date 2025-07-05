import { CSSProperties } from "react";
import { ScaleLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
export default function LoadingView() {
  return (
    <div className="top-0 left-0 z-50 fixed flex justify-center items-center bg-black/25 bg-opacity-25 w-screen h-screen">
      <div className="">
        <ScaleLoader
          color={"#ffffff"}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}
